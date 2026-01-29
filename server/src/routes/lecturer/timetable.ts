import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';

const router = Router();

// All routes require authentication and lecturer role
router.use(authenticate);
router.use(requireRole('LECTURER'));

/**
 * GET /api/lecturer/timetable
 * Get lecturer's complete teaching schedule
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Get all timetable slots for lecturer's subjects
        const timetableSlots = await prisma.timetableSlot.findMany({
            where: {
                subject: {
                    lecturerId: lecturer.id,
                },
            },
            include: {
                subject: {
                    include: {
                        course: true,
                        enrollments: {
                            where: { status: 'ACTIVE' },
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
        const timetableByDay = daysOrder.map((day) => ({
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
                        course: slot.subject.course.name,
                    },
                    room: slot.roomNumber,
                    type: slot.slotType,
                    enrolledStudents: slot.subject.enrollments.length,
                })),
        }));

        res.json({
            success: true,
            data: timetableByDay,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/timetable/today
 * Get today's teaching schedule
 */
router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Get current day
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

        // Get today's timetable slots
        const todaySlots = await prisma.timetableSlot.findMany({
            where: {
                dayOfWeek: today as any,
                subject: {
                    lecturerId: lecturer.id,
                },
            },
            include: {
                subject: {
                    include: {
                        course: true,
                        enrollments: {
                            where: { status: 'ACTIVE' },
                        },
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        res.json({
            success: true,
            data: {
                day: today,
                date: new Date().toISOString().split('T')[0],
                slots: todaySlots.map((slot) => ({
                    id: slot.id,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    subject: {
                        id: slot.subject.id,
                        name: slot.subject.name,
                        code: slot.subject.code,
                        course: slot.subject.course.name,
                    },
                    room: slot.roomNumber,
                    type: slot.slotType,
                    enrolledStudents: slot.subject.enrollments.length,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
