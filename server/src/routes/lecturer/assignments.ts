import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError, ValidationError } from '../../utils/errors';

const router = Router();

// All routes require authentication and lecturer role
router.use(authenticate);
router.use(requireRole('LECTURER'));

/**
 * GET /api/lecturer/assignments
 * Get all assignments created by the lecturer
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId, status } = req.query;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Build where clause
        const whereClause: any = {
            subject: {
                lecturerId: lecturer.id,
            },
        };

        if (subjectId) {
            whereClause.subjectId = subjectId as string;
        }

        if (status) {
            whereClause.status = status as string;
        }

        // Get assignments
        const assignments = await prisma.assignment.findMany({
            where: whereClause,
            include: {
                subject: {
                    include: {
                        course: true,
                    },
                },
                submissions: {
                    include: {
                        student: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate statistics for each assignment
        const assignmentsWithStats = assignments.map((assignment) => {
            const totalSubmissions = assignment.submissions.length;
            const gradedSubmissions = assignment.submissions.filter(s => s.status === 'GRADED').length;
            const lateSubmissions = assignment.submissions.filter(s => s.status === 'LATE').length;
            const avgGrade = gradedSubmissions > 0
                ? assignment.submissions
                    .filter(s => s.grade !== null)
                    .reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions
                : null;

            return {
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                subject: {
                    id: assignment.subject.id,
                    name: assignment.subject.name,
                    code: assignment.subject.code,
                    course: assignment.subject.course.name,
                },
                dueDate: assignment.dueDate,
                totalMarks: assignment.totalMarks,
                status: assignment.status,
                attachments: assignment.attachments,
                createdAt: assignment.createdAt,
                updatedAt: assignment.updatedAt,
                stats: {
                    totalSubmissions,
                    gradedSubmissions,
                    lateSubmissions,
                    pendingGrading: totalSubmissions - gradedSubmissions,
                    averageGrade: avgGrade ? Math.round(avgGrade * 100) / 100 : null,
                },
            };
        });

        res.json({
            success: true,
            data: assignmentsWithStats,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/lecturer/assignments
 * Create a new assignment
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { title, description, subjectId, dueDate, totalMarks, attachments, status } = req.body;

        // Validate input
        if (!title || !description || !subjectId || !dueDate || !totalMarks) {
            throw new ValidationError('Title, description, subject, due date, and total marks are required');
        }

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify subject belongs to lecturer
        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                lecturerId: lecturer.id,
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Create assignment
        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                subjectId,
                createdBy: userId,
                dueDate: new Date(dueDate),
                totalMarks: parseInt(totalMarks),
                attachments: attachments || [],
                status: status || 'DRAFT',
            },
            include: {
                subject: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/lecturer/assignments/:id
 * Update an assignment
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { title, description, dueDate, totalMarks, attachments, status } = req.body;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify assignment belongs to lecturer
        const assignment = await prisma.assignment.findFirst({
            where: {
                id,
                subject: {
                    lecturerId: lecturer.id,
                },
            },
        });

        if (!assignment) {
            throw new NotFoundError('Assignment not found or access denied');
        }

        // Build update data
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (totalMarks) updateData.totalMarks = parseInt(totalMarks);
        if (attachments) updateData.attachments = attachments;
        if (status) updateData.status = status;

        // Update assignment
        const updatedAssignment = await prisma.assignment.update({
            where: { id },
            data: updateData,
            include: {
                subject: true,
            },
        });

        res.json({
            success: true,
            message: 'Assignment updated successfully',
            data: updatedAssignment,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/lecturer/assignments/:id
 * Delete an assignment
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify assignment belongs to lecturer
        const assignment = await prisma.assignment.findFirst({
            where: {
                id,
                subject: {
                    lecturerId: lecturer.id,
                },
            },
        });

        if (!assignment) {
            throw new NotFoundError('Assignment not found or access denied');
        }

        // Delete assignment (submissions will be cascade deleted)
        await prisma.assignment.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Assignment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/assignments/:id/submissions
 * Get submissions for an assignment
 */
router.get('/:id/submissions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { status } = req.query;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify assignment belongs to lecturer
        const assignment = await prisma.assignment.findFirst({
            where: {
                id,
                subject: {
                    lecturerId: lecturer.id,
                },
            },
            include: {
                subject: true,
            },
        });

        if (!assignment) {
            throw new NotFoundError('Assignment not found or access denied');
        }

        // Build where clause
        const whereClause: any = {
            assignmentId: id,
        };

        if (status) {
            whereClause.status = status as string;
        }

        // Get submissions
        const submissions = await prisma.submission.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: {
                assignment: {
                    id: assignment.id,
                    title: assignment.title,
                    subject: assignment.subject.name,
                    dueDate: assignment.dueDate,
                    totalMarks: assignment.totalMarks,
                },
                submissions: submissions.map((submission) => ({
                    id: submission.id,
                    student: {
                        id: submission.student.id,
                        name: `${submission.student.firstName} ${submission.student.lastName}`,
                        email: submission.student.email,
                        avatar: submission.student.avatar,
                    },
                    submittedAt: submission.submittedAt,
                    files: submission.files,
                    remarks: submission.remarks,
                    grade: submission.grade,
                    feedback: submission.feedback,
                    status: submission.status,
                    gradedAt: submission.gradedAt,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/lecturer/assignments/submissions/:id/grade
 * Grade a submission
 */
router.put('/submissions/:id/grade', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { grade, feedback } = req.body;

        // Validate input
        if (grade === undefined || grade === null) {
            throw new ValidationError('Grade is required');
        }

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify submission belongs to lecturer's assignment
        const submission = await prisma.submission.findFirst({
            where: {
                id,
                assignment: {
                    subject: {
                        lecturerId: lecturer.id,
                    },
                },
            },
            include: {
                assignment: true,
            },
        });

        if (!submission) {
            throw new NotFoundError('Submission not found or access denied');
        }

        // Validate grade is within range
        const gradeValue = parseFloat(grade);
        if (gradeValue < 0 || gradeValue > submission.assignment.totalMarks) {
            throw new ValidationError(`Grade must be between 0 and ${submission.assignment.totalMarks}`);
        }

        // Update submission with grade
        const gradedSubmission = await prisma.submission.update({
            where: { id },
            data: {
                grade: gradeValue,
                feedback: feedback || null,
                gradedBy: userId,
                gradedAt: new Date(),
                status: 'GRADED',
            },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Submission graded successfully',
            data: {
                id: gradedSubmission.id,
                studentName: `${gradedSubmission.student.firstName} ${gradedSubmission.student.lastName}`,
                grade: gradedSubmission.grade,
                feedback: gradedSubmission.feedback,
                gradedAt: gradedSubmission.gradedAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
