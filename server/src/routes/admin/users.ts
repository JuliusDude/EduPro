import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { EnrollmentStatus } from '@prisma/client';
import prisma from '../../services/prisma';
import { authenticate, authorize } from '../../middleware/auth';
import { ValidationError, NotFoundError } from '../../utils/errors';
import { hashPassword } from '../../utils/bcrypt';
import logger from '../../utils/logger';

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

/**
 * GET /api/admin/users
 * Get all users with optional filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, department, status } = req.query;

        const where: any = {};
        if (role) where.role = role;
        if (department) where.department = department;
        if (status) where.status = status;

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                status: true,
                createdAt: true,
                lastLogin: true,
                avatar: true,
                lecturer: {
                    select: {
                        id: true
                    }
                },
                student: true
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: { users },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/users
 * Create a new user
 */
router.post(
    '/',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('role').isIn(['STUDENT', 'LECTURER', 'ADMIN']).withMessage('Invalid role'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { email, password, firstName, lastName, role, departmentId, phone, studentId, semester } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                throw new ValidationError('User with this email already exists');
            }

            // Find department name if ID provided
            let departmentName = '';
            if (departmentId) {
                const dept = await prisma.department.findUnique({ where: { id: departmentId } });
                if (dept) departmentName = dept.name;
            }

            const hashedPassword = await hashPassword(password);

            const result = await prisma.$transaction(async (prisma) => {
                const user = await prisma.user.create({
                    data: {
                        email: email.toLowerCase(),
                        password: hashedPassword,
                        firstName,
                        lastName,
                        role,
                        department: departmentName,
                        phone,
                        status: 'ACTIVE',
                    },
                });

                if (role === 'LECTURER' && departmentId) {
                    await prisma.lecturer.create({
                        data: {
                            userId: user.id,
                            departmentId: departmentId,
                            employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                        }
                    });
                } else if (role === 'STUDENT') {
                    const semesterInt = parseInt(semester) || 1;

                    // Find courses matching department and semester
                    const courses = await prisma.course.findMany({
                        where: {
                            departmentId,
                            semester: semesterInt
                        },
                        include: {
                            subjects: true
                        }
                    });

                    // Determine courseId to link (required by Student model)
                    let courseIdToLink = '';
                    if (courses.length > 0) {
                        courseIdToLink = courses[0].id;
                    } else {
                        // Fallback: find any course in department
                        const anyCourse = await prisma.course.findFirst({
                            where: { departmentId }
                        });
                        if (anyCourse) {
                            courseIdToLink = anyCourse.id;
                        } else {
                            const randomCourse = await prisma.course.findFirst();
                            if (randomCourse) courseIdToLink = randomCourse.id;
                            else throw new ValidationError('Cannot create student: No courses available in the system.');
                        }
                    }

                    const student = await prisma.student.create({
                        data: {
                            userId: user.id,
                            studentId: studentId || `S${Date.now()}`,
                            enrollmentDate: new Date(),
                            currentSemester: semesterInt,
                            courseId: courseIdToLink,
                        }
                    });

                    // Auto-enroll in subjects
                    const enrollments = [];
                    for (const course of courses) {
                        for (const subject of course.subjects) {
                            enrollments.push({
                                studentId: student.id,
                                subjectId: subject.id,
                                enrollmentDate: new Date(),
                                status: EnrollmentStatus.ACTIVE
                            });
                        }
                    }

                    if (enrollments.length > 0) {
                        await prisma.enrollment.createMany({
                            data: enrollments,
                            skipDuplicates: true
                        });
                    }
                }

                return user;
            });

            logger.info(`Admin created new user: ${result.email} with role ${result.role}`);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user: {
                        id: result.id,
                        email: result.email,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        role: result.role,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/admin/users/:id
 * Get user by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                student: true,
                lecturer: true,
            },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, role, departmentId, status, phone, semester } = req.body;

        // Find department name if ID provided
        let departmentName = '';
        if (departmentId) {
            const dept = await prisma.department.findUnique({ where: { id: departmentId } });
            if (dept) departmentName = dept.name;
        }

        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    role,
                    department: departmentName || undefined,
                    status,
                    phone,
                },
                include: {
                    student: true,
                },
            });

            // If this is a student and semester is being updated
            if (user.student && semester) {
                const semesterInt = parseInt(semester);
                const currentSemester = user.student.currentSemester;

                // Only re-enroll if semester actually changed
                if (semesterInt !== currentSemester) {
                    // Update student's current semester
                    await prisma.student.update({
                        where: { id: user.student.id },
                        data: { currentSemester: semesterInt },
                    });

                    // Delete all existing enrollments
                    await prisma.enrollment.deleteMany({
                        where: { studentId: user.student.id },
                    });

                    // Find courses for new semester and department
                    const courses = await prisma.course.findMany({
                        where: {
                            departmentId: departmentId || undefined,
                            semester: semesterInt,
                        },
                        include: {
                            subjects: true,
                        },
                    });

                    // Create new enrollments
                    const enrollments = [];
                    for (const course of courses) {
                        for (const subject of course.subjects) {
                            enrollments.push({
                                studentId: user.student.id,
                                subjectId: subject.id,
                                enrollmentDate: new Date(),
                                status: EnrollmentStatus.ACTIVE,
                            });
                        }
                    }

                    if (enrollments.length > 0) {
                        await prisma.enrollment.createMany({
                            data: enrollments,
                            skipDuplicates: true,
                        });
                    }

                    logger.info(`Re-enrolled student ${user.email} from semester ${currentSemester} to ${semesterInt}`);
                }
            }

            return user;
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user: result },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
