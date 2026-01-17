import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
router.get(
    '/',
    authenticate,
    authorize(['ADMIN']),
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch counts in parallel
            const [
                totalUsers,
                totalCourses,
                totalDepartments,
                recentUsers
            ] = await Promise.all([
                prisma.user.count(),
                prisma.course.count(),
                prisma.department.count(),
                prisma.user.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        createdAt: true
                    }
                })
            ]);

            // Mock recent activity for now (since we don't have an activity log table yet)
            const recentActivity = [
                ...recentUsers.map(user => ({
                    id: user.id,
                    user: `${user.firstName} ${user.lastName}`,
                    action: 'Joined the platform',
                    target: user.role,
                    time: user.createdAt,
                    type: 'user'
                })),
                {
                    id: 'sys-1',
                    user: 'System',
                    action: 'Automated backup completed',
                    target: 'Database',
                    time: new Date(),
                    type: 'system'
                }
            ];

            res.json({
                success: true,
                data: {
                    stats: [
                        {
                            title: 'Total Users',
                            value: totalUsers,
                            change: '+12%', // Mock change
                            trend: 'up',
                            icon: 'Users',
                            color: 'blue'
                        },
                        {
                            title: 'Total Courses',
                            value: totalCourses,
                            change: '+4%', // Mock change
                            trend: 'up',
                            icon: 'BookOpen',
                            color: 'indigo'
                        },
                        {
                            title: 'Departments',
                            value: totalDepartments,
                            change: '0%', // Mock change
                            trend: 'neutral',
                            icon: 'Building2',
                            color: 'purple'
                        },
                        {
                            title: 'System Activity',
                            value: '98%', // Mock value
                            change: '+2%',
                            trend: 'up',
                            icon: 'Activity',
                            color: 'emerald'
                        }
                    ],
                    recentActivity
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
