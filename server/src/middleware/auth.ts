import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JWTPayload } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Authorization middleware - verifies user role
 */
export const authorize = (roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AuthenticationError('User not authenticated'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AuthenticationError('Not authorized to access this resource'));
        }

        next();
    };
};
