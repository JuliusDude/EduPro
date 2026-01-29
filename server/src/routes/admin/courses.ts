import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../../services/prisma';
import { authenticate, authorize } from '../../middleware/auth';
import { ValidationError, NotFoundError } from '../../utils/errors';
import logger from '../../utils/logger';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

/**
 * GET /api/admin/courses
 * Get all courses with related data
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { departmentId } = req.query;

        const where: any = {};
        if (departmentId) where.departmentId = departmentId;

        const courses = await prisma.course.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
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
                        enrollments: {
                            select: {
                                studentId: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Transform data for frontend
        const transformedCourses = courses.map(course => {
            // Count unique students enrolled in any subject of this course
            const uniqueStudentIds = new Set<string>();
            course.subjects.forEach(subject => {
                subject.enrollments.forEach(enrollment => {
                    uniqueStudentIds.add(enrollment.studentId);
                });
            });

            return {
                id: course.id,
                code: course.code,
                name: course.name,
                department: course.department.name,
                departmentId: course.departmentId,
                semester: course.semester,
                credits: course.credits,
                weeks: course.weeks,
                description: course.description,
                students: uniqueStudentIds.size,
                lecturer: course.subjects[0]?.lecturer?.user
                    ? `${course.subjects[0].lecturer.user.firstName} ${course.subjects[0].lecturer.user.lastName}`
                    : 'Unassigned',
                status: 'active',
                createdAt: course.createdAt,
            };
        });

        res.json({
            success: true,
            data: { courses: transformedCourses },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/courses
 * Create a new course
 */
router.post(
    '/',
    [
        body('code').notEmpty().withMessage('Course code is required'),
        body('name').notEmpty().withMessage('Course name is required'),
        body('departmentId').notEmpty().withMessage('Department is required'),
        body('semester').isInt({ min: 1 }).withMessage('Valid semester is required'),
        body('credits').isInt({ min: 1 }).withMessage('Valid credits is required'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { code, name, departmentId, semester, credits, weeks, description } = req.body;

            // Check if course code already exists
            const existingCourse = await prisma.course.findUnique({
                where: { code },
            });

            if (existingCourse) {
                throw new ValidationError('Course with this code already exists');
            }

            const course = await prisma.course.create({
                data: {
                    code,
                    name,
                    departmentId,
                    semester: parseInt(semester),
                    credits: parseInt(credits),
                    weeks: weeks ? parseInt(weeks) : 16,
                    description,
                },
                include: {
                    department: true,
                },
            });

            logger.info(`Admin created new course: ${course.code}`);

            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: { course },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/admin/courses/:id
 * Get course by ID
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
                                user: true,
                            },
                        },
                    },
                },
                students: {
                    include: {
                        user: true,
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

/**
 * PUT /api/admin/courses/:id
 * Update course
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { code, name, departmentId, semester, credits, weeks, description } = req.body;

        const course = await prisma.course.update({
            where: { id },
            data: {
                code,
                name,
                departmentId,
                semester: semester ? parseInt(semester) : undefined,
                credits: credits ? parseInt(credits) : undefined,
                weeks: weeks ? parseInt(weeks) : undefined,
                description,
            },
            include: {
                department: true,
            },
        });

        logger.info(`Admin updated course: ${course.code}`);

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: { course },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/courses/:id
 * Delete course
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.course.delete({
            where: { id },
        });

        logger.info(`Admin deleted course: ${id}`);

        res.json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/courses/:id/subjects
 * Create a new subject for a course (assign lecturer)
 */
router.post('/:id/subjects', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { lecturerId, name, code } = req.body;

        if (!lecturerId || !name || !code) {
            throw new ValidationError('Lecturer, name, and code are required');
        }

        // Verify lecturer exists
        const lecturer = await prisma.lecturer.findUnique({
            where: { id: lecturerId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer not found');
        }

        const subject = await prisma.subject.create({
            data: {
                courseId: id,
                lecturerId,
                name,
                code,
                weeklyHours: 4, // Default
                totalHours: 60, // Default
                semester: 1, // Default
            },
            include: {
                lecturer: {
                    include: {
                        user: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: { subject },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/courses/:id/subjects/:subjectId
 * Delete a subject (remove lecturer assignment)
 */
router.delete('/:id/subjects/:subjectId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subjectId } = req.params;

        await prisma.subject.delete({
            where: { id: subjectId },
        });

        res.json({
            success: true,
            message: 'Subject deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/admin/courses/:id/students
 * Get students enrolled in a specific course
 */
router.get('/:id/students', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id },
            include: {
                subjects: {
                    include: {
                        enrollments: {
                            include: {
                                student: {
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

        if (!course) {
            throw new NotFoundError('Course not found');
        }

        // Collect unique students and their enrolled subjects
        const studentMap = new Map<string, any>();

        course.subjects.forEach(subject => {
            subject.enrollments.forEach(enrollment => {
                const studentId = enrollment.student.id;
                if (!studentMap.has(studentId)) {
                    studentMap.set(studentId, {
                        id: enrollment.student.id,
                        studentId: enrollment.student.studentId,
                        name: `${enrollment.student.user.firstName} ${enrollment.student.user.lastName}`,
                        email: enrollment.student.user.email,
                        currentSemester: enrollment.student.currentSemester,
                        enrolledSubjects: [],
                    });
                }
                studentMap.get(studentId).enrolledSubjects.push({
                    subjectId: subject.id,
                    subjectName: subject.name,
                    subjectCode: subject.code,
                });
            });
        });

        const students = Array.from(studentMap.values());

        res.json({
            success: true,
            data: { students },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
