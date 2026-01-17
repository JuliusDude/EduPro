import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError, ValidationError } from '../../utils/errors';

const router = Router();

router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/attendance
 * Get attendance summary for all enrolled subjects
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        subject: true,
                        attendances: {
                            orderBy: { date: 'desc' },
                        },
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        // Calculate attendance for each subject
        const attendanceData = student.enrollments.map((enrollment) => {
            const total = enrollment.attendances.length;
            const attended = enrollment.attendances.filter(
                (att) => att.status === 'PRESENT' || att.status === 'LATE'
            ).length;
            const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

            // Calculate classes needed/can miss
            const target = student.targetAttendance;
            let classesNeeded = 0;
            let canMiss = 0;

            if (percentage < target && total > 0) {
                // Need to attend more classes
                classesNeeded = Math.ceil((target * total - attended * 100) / (100 - target));
            } else if (percentage >= target && total > 0) {
                // Can miss some classes
                canMiss = Math.floor((attended * 100 - target * total) / target);
            }

            return {
                subjectId: enrollment.subject.id,
                subjectName: enrollment.subject.name,
                subjectCode: enrollment.subject.code,
                attended,
                total,
                percentage,
                targetPercentage: target,
                classesNeeded: classesNeeded > 0 ? classesNeeded : 0,
                canMiss: canMiss > 0 ? canMiss : 0,
                status:
                    percentage >= 85
                        ? 'good'
                        : percentage >= 75
                            ? 'warning'
                            : 'danger',
            };
        });

        res.json({
            success: true,
            data: {
                subjects: attendanceData,
                targetAttendance: student.targetAttendance,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/student/attendance/:subjectId
 * Get detailed attendance for a specific subject
 */
router.get('/:subjectId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId } = req.params;

        const student = await prisma.student.findUnique({
            where: { userId },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        const enrollment = await prisma.enrollment.findFirst({
            where: {
                studentId: student.id,
                subjectId,
                status: 'ACTIVE',
            },
            include: {
                subject: true,
                attendances: {
                    orderBy: { date: 'desc' },
                },
            },
        });

        if (!enrollment) {
            throw new NotFoundError('Enrollment not found');
        }

        res.json({
            success: true,
            data: {
                subject: {
                    id: enrollment.subject.id,
                    name: enrollment.subject.name,
                    code: enrollment.subject.code,
                },
                attendances: enrollment.attendances.map((att) => ({
                    id: att.id,
                    date: att.date,
                    status: att.status,
                    remarks: att.remarks,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/student/attendance/target
 * Update target attendance percentage
 */
router.put(
    '/target',
    [body('targetAttendance').isInt({ min: 0, max: 100 }).withMessage('Target must be between 0 and 100')],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const userId = req.user!.userId;
            const { targetAttendance } = req.body;

            const student = await prisma.student.update({
                where: { userId },
                data: { targetAttendance },
            });

            res.json({
                success: true,
                message: 'Target attendance updated',
                data: {
                    targetAttendance: student.targetAttendance,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
