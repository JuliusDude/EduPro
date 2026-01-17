import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';

const router = Router();

router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/timetable
 * Get weekly timetable for enrolled subjects
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                enrollments: {
                    where: { status: 'ACTIVE' },
                    select: {
                        subjectId: true,
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        const subjectIds = student.enrollments.map((e) => e.subjectId);

        const timetableSlots = await prisma.timetableSlot.findMany({
            where: {
                subjectId: {
                    in: subjectIds,
                },
            },
            include: {
                subject: {
                    include: {
                        lecturer: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' },
            ],
        });

        // Group by day of week
        const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        const timetable = daysOrder.map((day) => ({
            day,
            slots: timetableSlots
                .filter((slot) => slot.dayOfWeek === day)
                .map((slot) => ({
                    id: slot.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    subject: {
                        id: slot.subject.id,
                        name: slot.subject.name,
                        code: slot.subject.code,
                    },
                    lecturer: {
                        name: `${slot.subject.lecturer.user.firstName} ${slot.subject.lecturer.user.lastName}`,
                    },
                    roomNumber: slot.roomNumber,
                    slotType: slot.slotType,
                })),
        }));

        res.json({
            success: true,
            data: { timetable },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
