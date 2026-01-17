import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
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

            const { email, password, firstName, lastName, role, department, phone } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                throw new ValidationError('User with this email already exists');
            }

            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    firstName,
                    lastName,
                    role,
                    department,
                    phone,
                    status: 'ACTIVE',
                },
            });

            logger.info(`Admin created new user: ${user.email} with role ${user.role}`);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
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
        const { firstName, lastName, role, department, status, phone } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                role,
                department,
                status,
                phone,
            },
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user },
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
