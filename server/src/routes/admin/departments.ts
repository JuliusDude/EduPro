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
 * GET /api/admin/departments
 * Get all departments with related counts
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: {
                        courses: true,
                        lecturers: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });

        // Transform data for frontend
        const transformedDepartments = departments.map(dept => ({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            head: dept.headOfDepartment || 'Not Assigned',
            description: dept.description,
            coursesCount: dept._count.courses,
            lecturersCount: dept._count.lecturers,
            createdAt: dept.createdAt,
        }));

        res.json({
            success: true,
            data: { departments: transformedDepartments },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/departments
 * Create a new department
 */
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Department name is required'),
        body('code').notEmpty().withMessage('Department code is required'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { name, code, headOfDepartment, description } = req.body;

            // Check if department code already exists
            const existingDept = await prisma.department.findFirst({
                where: {
                    OR: [{ code }, { name }],
                },
            });

            if (existingDept) {
                throw new ValidationError('Department with this code or name already exists');
            }

            const department = await prisma.department.create({
                data: {
                    name,
                    code: code.toUpperCase(),
                    headOfDepartment,
                    description,
                },
            });

            logger.info(`Admin created new department: ${department.name}`);

            res.status(201).json({
                success: true,
                message: 'Department created successfully',
                data: { department },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/admin/departments/:id
 * Get department by ID with full details
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                courses: true,
                lecturers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        if (!department) {
            throw new NotFoundError('Department not found');
        }

        res.json({
            success: true,
            data: { department },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/admin/departments/:id
 * Update department
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, code, headOfDepartment, description } = req.body;

        const department = await prisma.department.update({
            where: { id },
            data: {
                name,
                code: code?.toUpperCase(),
                headOfDepartment,
                description,
            },
        });

        logger.info(`Admin updated department: ${department.name}`);

        res.json({
            success: true,
            message: 'Department updated successfully',
            data: { department },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/departments/:id
 * Delete department
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Check if department has any courses or lecturers
        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        courses: true,
                        lecturers: true,
                    },
                },
            },
        });

        if (!department) {
            throw new NotFoundError('Department not found');
        }

        if (department._count.courses > 0 || department._count.lecturers > 0) {
            throw new ValidationError(
                'Cannot delete department with existing courses or lecturers. Please reassign them first.'
            );
        }

        await prisma.department.delete({
            where: { id },
        });

        logger.info(`Admin deleted department: ${id}`);

        res.json({
            success: true,
            message: 'Department deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
