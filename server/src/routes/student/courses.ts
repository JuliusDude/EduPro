import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';

const router = Router();

router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/courses
 * Get enrolled courses and subjects
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const student = await prisma.student.findUnique({
            where: { userId },
            include: {
                course: {
                    include: {
                        department: true,
                    },
                },
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        subject: {
                            include: {
                                lecturer: {
                                    include: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        const course = {
            id: student.course.id,
            name: student.course.name,
            code: student.course.code,
            semester: student.course.semester,
            department: student.course.department.name,
            subjects: student.enrollments.map((enrollment) => ({
                id: enrollment.subject.id,
                code: enrollment.subject.code,
                name: enrollment.subject.name,
                weeklyHours: enrollment.subject.weeklyHours,
                totalHours: enrollment.subject.totalHours,
                lecturer: {
                    name: `${enrollment.subject.lecturer.user.firstName} ${enrollment.subject.lecturer.user.lastName}`,
                    email: enrollment.subject.lecturer.user.email,
                },
                enrollmentStatus: enrollment.status,
                finalGrade: enrollment.finalGrade,
            })),
        };

        res.json({
            success: true,
            data: { course },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/student/courses/:id
 * Get course details with subjects
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                department: true,
                subjects: {
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
        });

        if (!course) {
            throw new NotFoundError('Course not found');
        }

        res.json({
            success: true,
            data: { course },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
