import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errors';

type UserRole = 'STUDENT' | 'LECTURER' | 'ADMIN';

/**
 * Role-based access control middleware
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new AuthorizationError('User not authenticated');
            }

            const userRole = req.user.role as UserRole;

            if (!allowedRoles.includes(userRole)) {
                throw new AuthorizationError(
                    `Access denied. Required roles: ${allowedRoles.join(', ')}`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
