import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { uploadAssignment } from '../../middleware/upload';
import { NotFoundError, ValidationError } from '../../utils/errors';

const router = Router();

router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/assignments
 * Get all assignments with optional status filter
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { status } = req.query;

        const student = await prisma.student.findUnique({
            where: { userId },
        });

        if (!student) {
            throw new NotFoundError('Student profile not found');
        }

        // Build where clause based on status filter
        let submissionWhere: any = {};
        if (status === 'pending') {
            submissionWhere = { none: { studentId: userId } };
        } else if (status === 'submitted') {
            submissionWhere = {
                some: {
                    studentId: userId,
                    status: { in: ['SUBMITTED', 'LATE'] },
                },
            };
        } else if (status === 'graded') {
            submissionWhere = {
                some: {
                    studentId: userId,
                    status: 'GRADED',
                },
            };
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                status: 'PUBLISHED',
                subject: {
                    enrollments: {
                        some: {
                            studentId: student.id,
                            status: 'ACTIVE',
                        },
                    },
                },
                ...(status && { submissions: submissionWhere }),
            },
            include: {
                subject: true,
                submissions: {
                    where: { studentId: userId },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        const assignmentsWithStatus = assignments.map((assignment) => {
            const submission = assignment.submissions[0];
            const isOverdue = new Date() > new Date(assignment.dueDate);

            let assignmentStatus = 'pending';
            if (submission) {
                assignmentStatus = submission.status.toLowerCase();
            } else if (isOverdue) {
                assignmentStatus = 'overdue';
            }

            return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                subject: assignment.subject.name,
                subjectCode: assignment.subject.code,
                dueDate: assignment.dueDate,
                totalMarks: assignment.totalMarks,
                attachments: assignment.attachments,
                status: assignmentStatus,
                submission: submission
                    ? {
                        id: submission.id,
                        submittedAt: submission.submittedAt,
                        grade: submission.grade,
                        feedback: submission.feedback,
                        files: submission.files,
                    }
                    : null,
            };
        });

        res.json({
            success: true,
            data: {
                assignments: assignmentsWithStatus,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/student/assignments/:id
 * Get assignment details
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const assignment = await prisma.assignment.findUnique({
            where: { id },
            include: {
                subject: true,
                submissions: {
                    where: { studentId: userId },
                },
            },
        });

        if (!assignment) {
            throw new NotFoundError('Assignment not found');
        }

        res.json({
            success: true,
            data: {
                assignment: {
                    id: assignment.id,
                    title: assignment.title,
                    description: assignment.description,
                    subject: assignment.subject.name,
                    dueDate: assignment.dueDate,
                    totalMarks: assignment.totalMarks,
                    attachments: assignment.attachments,
                    submission: assignment.submissions[0] || null,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/student/assignments/:id/submit
 * Submit assignment with file upload
 */
router.post(
    '/:id/submit',
    uploadAssignment.array('files', 5),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;
            const { remarks } = req.body;
            const files = req.files as Express.Multer.File[];

            // Verify assignment exists and is published
            const assignment = await prisma.assignment.findUnique({
                where: { id },
            });

            if (!assignment) {
                throw new NotFoundError('Assignment not found');
            }

            if (assignment.status !== 'PUBLISHED') {
                throw new ValidationError('This assignment is not accepting submissions');
            }

            // Check if already submitted
            const existingSubmission = await prisma.submission.findFirst({
                where: {
                    assignmentId: id,
                    studentId: userId,
                },
            });

            if (existingSubmission) {
                throw new ValidationError('You have already submitted this assignment');
            }

            // Prepare file data
            const fileData = files.map((file) => ({
                name: file.originalname,
                url: `/uploads/${file.filename}`,
                size: file.size,
            }));

            // Determine submission status
            const isLate = new Date() > new Date(assignment.dueDate);
            const submissionStatus = isLate ? 'LATE' : 'SUBMITTED';

            // Create submission
            const submission = await prisma.submission.create({
                data: {
                    assignmentId: id,
                    studentId: userId,
                    submittedAt: new Date(),
                    files: fileData,
                    remarks,
                    status: submissionStatus,
                },
            });

            // Create notification for lecturer
            await prisma.notification.create({
                data: {
                    userId: assignment.createdBy,
                    type: 'ASSIGNMENT',
                    title: 'New Assignment Submission',
                    message: `A student has submitted ${assignment.title}`,
                    relatedEntityType: 'submission',
                    relatedEntityId: submission.id,
                },
            });

            res.json({
                success: true,
                message: 'Assignment submitted successfully',
                data: { submission },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/student/submissions/:id
 * Get submission details with feedback
 */
router.get('/submissions/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const submission = await prisma.submission.findFirst({
            where: {
                id,
                studentId: userId,
            },
            include: {
                assignment: {
                    include: {
                        subject: true,
                    },
                },
            },
        });

        if (!submission) {
            throw new NotFoundError('Submission not found');
        }

        res.json({
            success: true,
            data: { submission },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
