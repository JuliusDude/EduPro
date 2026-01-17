import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Global error handler middleware
 */
const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log the error
    logger.error('Error:', err);

    // Handle known operational errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        res.status(400).json({
            success: false,
            message: 'Database error occurred',
        });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired',
        });
        return;
    }

    // Handle unknown errors
    const statusCode = 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
