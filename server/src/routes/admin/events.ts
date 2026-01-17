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
 * GET /api/admin/events
 * Get all events with optional filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { eventType, startDate, endDate, departmentId } = req.query;

        const where: any = {};

        if (eventType) where.eventType = eventType;
        if (departmentId) where.departmentId = departmentId;

        if (startDate || endDate) {
            where.startDate = {};
            if (startDate) where.startDate.gte = new Date(startDate as string);
            if (endDate) where.startDate.lte = new Date(endDate as string);
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { startDate: 'asc' },
        });

        // Transform data for frontend
        const transformedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            type: event.eventType.toLowerCase(),
            start: event.startDate,
            end: event.endDate,
            location: event.location,
            isAllDay: event.isAllDay,
            department: event.department?.name || null,
            departmentId: event.departmentId,
            createdBy: `${event.creator.firstName} ${event.creator.lastName}`,
            createdAt: event.createdAt,
        }));

        res.json({
            success: true,
            data: { events: transformedEvents },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/admin/events
 * Create a new event
 */
router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Event title is required'),
        body('eventType').isIn(['EXAM', 'HOLIDAY', 'MEETING', 'WORKSHOP', 'OTHER']).withMessage('Invalid event type'),
        body('startDate').isISO8601().withMessage('Valid start date is required'),
        body('endDate').isISO8601().withMessage('Valid end date is required'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ValidationError(errors.array()[0].msg);
            }

            const { title, description, eventType, startDate, endDate, location, departmentId, isAllDay } = req.body;

            const event = await prisma.event.create({
                data: {
                    title,
                    description,
                    eventType,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    location,
                    departmentId,
                    isAllDay: isAllDay || false,
                    createdBy: req.user!.userId,
                },
                include: {
                    creator: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    department: true,
                },
            });

            logger.info(`Admin created new event: ${event.title}`);

            res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: { event },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/admin/events/:id
 * Get event by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                creator: true,
                department: true,
            },
        });

        if (!event) {
            throw new NotFoundError('Event not found');
        }

        res.json({
            success: true,
            data: { event },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/admin/events/:id
 * Update event
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, eventType, startDate, endDate, location, departmentId, isAllDay } = req.body;

        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                eventType,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                location,
                departmentId,
                isAllDay,
            },
        });

        logger.info(`Admin updated event: ${event.title}`);

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: { event },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/admin/events/:id
 * Delete event
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.event.delete({
            where: { id },
        });

        logger.info(`Admin deleted event: ${id}`);

        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
