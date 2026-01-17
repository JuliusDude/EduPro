import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';

const router = Router();

// All routes require authentication and student role
router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/dashboard
 * Get dashboard data for student
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get student details
        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                course: true,
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        subject: true,
                        attendances: true,
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        // Calculate overall attendance
        const totalAttendances = student.enrollments.reduce(
            (sum, enrollment) => sum + enrollment.attendances.length,
            0
        );
        const presentCount = student.enrollments.reduce(
            (sum, enrollment) =>
                sum +
                enrollment.attendances.filter((att) => att.status === 'PRESENT' || att.status === 'LATE')
                    .length,
            0
        );
        const attendancePercentage = totalAttendances > 0
            ? Math.round((presentCount / totalAttendances) * 100)
            : 0;

        // Get pending assignments
        const pendingAssignments = await prisma.assignment.findMany({
            where: {
                status: 'PUBLISHED',
                subject: {
                    enrollments: {
                        some: {
                            studentId: student.id,
                            status: 'ACTIVE',
                        },
                    },
                },
                dueDate: {
                    gte: new Date(),
                },
                submissions: {
                    none: {
                        studentId: userId,
                    },
                },
            },
            include: {
                subject: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
            take: 5,
        });

        // Get today's schedule
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const todaySchedule = await prisma.timetableSlot.findMany({
            where: {
                dayOfWeek: today as any,
                subject: {
                    enrollments: {
                        some: {
                            studentId: student.id,
                            status: 'ACTIVE',
                        },
                    },
                },
            },
            include: {
                subject: true,
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        res.json({
            success: true,
            data: {
                gpa: student.gpa || 0,
                attendancePercentage,
                totalCourses: student.enrollments.length,
                pendingAssignments: pendingAssignments.length,
                todaySchedule: todaySchedule.map((slot) => ({
                    time: `${slot.startTime} - ${slot.endTime}`,
                    subject: slot.subject.name,
                    type: slot.slotType,
                    room: slot.roomNumber,
                })),
                upcomingAssignments: pendingAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: assignment.title,
                    subject: assignment.subject.name,
                    dueDate: assignment.dueDate,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
