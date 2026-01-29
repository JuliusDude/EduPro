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
 * GET /api/lecturer/dashboard
 * Get dashboard data for lecturer
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
            include: {
                department: true,
                subjects: {
                    include: {
                        course: true,
                        enrollments: {
                            where: { status: 'ACTIVE' },
                        },
                    },
                },
            },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Calculate total students across all subjects
        const totalStudents = lecturer.subjects.reduce(
            (sum, subject) => sum + subject.enrollments.length,
            0
        );

        // Get pending submissions to grade
        const pendingSubmissions = await prisma.submission.findMany({
            where: {
                assignment: {
                    subject: {
                        lecturerId: lecturer.id,
                    },
                },
                status: 'SUBMITTED',
            },
            include: {
                assignment: {
                    include: {
                        subject: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'asc',
            },
            take: 10,
        });

        // Get today's schedule
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const todaySchedule = await prisma.timetableSlot.findMany({
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
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        // Get recent assignments created
        const recentAssignments = await prisma.assignment.findMany({
            where: {
                subject: {
                    lecturerId: lecturer.id,
                },
            },
            include: {
                subject: true,
                submissions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });

        res.json({
            success: true,
            data: {
                stats: {
                    totalSubjects: lecturer.subjects.length,
                    totalStudents,
                    pendingGrading: pendingSubmissions.length,
                    activeAssignments: recentAssignments.filter(a => a.status === 'PUBLISHED').length,
                },
                todaySchedule: todaySchedule.map((slot) => ({
                    id: slot.id,
                    time: `${slot.startTime} - ${slot.endTime}`,
                    subject: slot.subject.name,
                    subjectCode: slot.subject.code,
                    course: slot.subject.course.name,
                    type: slot.slotType,
                    room: slot.roomNumber,
                })),
                pendingSubmissions: pendingSubmissions.map((submission) => ({
                    id: submission.id,
                    student: `${submission.student.firstName} ${submission.student.lastName}`,
                    assignment: submission.assignment.title,
                    subject: submission.assignment.subject.name,
                    submittedAt: submission.submittedAt,
                })),
                recentAssignments: recentAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: assignment.title,
                    subject: assignment.subject.name,
                    dueDate: assignment.dueDate,
                    status: assignment.status,
                    totalSubmissions: assignment.submissions.length,
                    gradedSubmissions: assignment.submissions.filter(s => s.status === 'GRADED').length,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
