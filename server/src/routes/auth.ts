import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../services/prisma';
import { comparePassword } from '../utils/bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { authenticate } from '../middleware/auth';
import { ValidationError, AuthenticationError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /api/auth/login
 * User login with email/username and password
 */
router.post(
    '/login',
    [
        body('email').trim().notEmpty().withMessage('Email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                include: {
                    student: true,
                    lecturer: true,
                },
            });

            if (!user) {
                throw new AuthenticationError('Invalid email or password');
            }

            // Check if user is active
            if (user.status !== 'ACTIVE') {
                throw new AuthenticationError('Your account has been suspended. Please contact admin.');
            }

            // Verify password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new AuthenticationError('Invalid email or password');
            }

            // Generate tokens
            const tokens = generateTokens({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });

            logger.info(`User logged in: ${user.email}`);

            // Return user data and tokens
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        department: user.department,
                        avatar: user.avatar,
                    },
                    ...tokens,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new ValidationError('Refresh token is required');
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Generate new tokens
        const tokens = generateTokens({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new AuthenticationError('User not authenticated');
        }

        // Fetch user details
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                avatar: true,
                phone: true,
                status: true,
                createdAt: true,
                lastLogin: true,
                student: {
                    select: {
                        studentId: true,
                        currentSemester: true,
                        gpa: true,
                        targetAttendance: true,
                        course: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                lecturer: {
                    select: {
                        employeeId: true,
                        specialization: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
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
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`User logged out: ${req.user?.email}`);

        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
