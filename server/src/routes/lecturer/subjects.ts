import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';
import { noteUpload, getFileUrl } from '../../utils/upload';

const router = Router();

// All routes require authentication and lecturer role
router.use(authenticate);
router.use(requireRole('LECTURER'));

/**
 * GET /api/lecturer/subjects
 * Get all subjects assigned to the lecturer
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Get all subjects with enrollment and attendance data
        const subjects = await prisma.subject.findMany({
            where: {
                lecturerId: lecturer.id,
            },
            include: {
                course: {
                    include: {
                        department: true,
                    },
                },
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                        attendances: true,
                    },
                },
                assignments: {
                    include: {
                        submissions: true,
                    },
                },
                timetableSlots: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Calculate statistics for each subject
        const subjectsWithStats = subjects.map((subject) => {
            const totalClasses = subject.enrollments.reduce(
                (max, enrollment) => Math.max(max, enrollment.attendances.length),
                0
            );

            const avgAttendance = subject.enrollments.length > 0
                ? subject.enrollments.reduce((sum, enrollment) => {
                    const presentCount = enrollment.attendances.filter(
                        (att) => att.status === 'PRESENT' || att.status === 'LATE'
                    ).length;
                    const percentage = enrollment.attendances.length > 0
                        ? (presentCount / enrollment.attendances.length) * 100
                        : 0;
                    return sum + percentage;
                }, 0) / subject.enrollments.length
                : 0;

            return {
                id: subject.id,
                code: subject.code,
                name: subject.name,
                course: subject.course.name,
                department: subject.course.department.name,
                semester: subject.semester,
                weeklyHours: subject.weeklyHours,
                totalHours: subject.totalHours,
                roomNumber: subject.roomNumber,
                enrolledStudents: subject.enrollments.length,
                totalClasses,
                averageAttendance: Math.round(avgAttendance),
                totalAssignments: subject.assignments.length,
                activeAssignments: subject.assignments.filter(a => a.status === 'PUBLISHED').length,
            };
        });

        res.json({
            success: true,
            data: subjectsWithStats,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/subjects/:id
 * Get detailed information about a specific subject
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
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

        // Get subject with full details
        const subject = await prisma.subject.findFirst({
            where: {
                id,
                lecturerId: lecturer.id, // Ensure lecturer owns this subject
            },
            include: {
                course: {
                    include: {
                        department: true,
                    },
                },
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        avatar: true,
                                    },
                                },
                            },
                        },
                        attendances: true,
                    },
                },
                assignments: {
                    include: {
                        submissions: true,
                    },
                    orderBy: {
                        dueDate: 'desc',
                    },
                },
                timetableSlots: {
                    orderBy: [
                        { dayOfWeek: 'asc' },
                        { startTime: 'asc' },
                    ],
                },
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        res.json({
            success: true,
            data: {
                id: subject.id,
                code: subject.code,
                name: subject.name,
                course: subject.course.name,
                department: subject.course.department.name,
                semester: subject.semester,
                weeklyHours: subject.weeklyHours,
                totalHours: subject.totalHours,
                roomNumber: subject.roomNumber,
                enrolledStudents: subject.enrollments.length,
                timetable: subject.timetableSlots.map(slot => ({
                    id: slot.id,
                    day: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    room: slot.roomNumber,
                    type: slot.slotType,
                })),
                assignments: subject.assignments.map(assignment => ({
                    id: assignment.id,
                    title: assignment.title,
                    dueDate: assignment.dueDate,
                    status: assignment.status,
                    totalMarks: assignment.totalMarks,
                    submissions: assignment.submissions.length,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/subjects/:id/students
 * Get enrolled students for a specific subject
 */
router.get('/:id/students', async (req: Request, res: Response, next: NextFunction) => {
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

        // Verify subject belongs to lecturer
        const subject = await prisma.subject.findFirst({
            where: {
                id,
                lecturerId: lecturer.id,
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Get enrolled students with their performance data
        const enrollments = await prisma.enrollment.findMany({
            where: {
                subjectId: id,
                status: 'ACTIVE',
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                avatar: true,
                                phone: true,
                            },
                        },
                        course: true,
                    },
                },
                attendances: true,
            },
            orderBy: {
                student: {
                    user: {
                        firstName: 'asc',
                    },
                },
            },
        });

        // Get submissions for this subject's assignments
        const assignments = await prisma.assignment.findMany({
            where: { subjectId: id },
            include: {
                submissions: true,
            },
        });

        const studentsWithStats = enrollments.map((enrollment) => {
            const totalClasses = enrollment.attendances.length;
            const presentCount = enrollment.attendances.filter(
                (att) => att.status === 'PRESENT' || att.status === 'LATE'
            ).length;
            const attendancePercentage = totalClasses > 0
                ? Math.round((presentCount / totalClasses) * 100)
                : 0;

            // Calculate assignment completion
            const studentSubmissions = assignments.reduce((count, assignment) => {
                return count + (assignment.submissions.some(s => s.studentId === enrollment.student.userId) ? 1 : 0);
            }, 0);
            const assignmentCompletion = assignments.length > 0
                ? Math.round((studentSubmissions / assignments.length) * 100)
                : 0;

            return {
                enrollmentId: enrollment.id,
                studentId: enrollment.student.id,
                userId: enrollment.student.user.id,
                studentNumber: enrollment.student.studentId,
                firstName: enrollment.student.user.firstName,
                lastName: enrollment.student.user.lastName,
                email: enrollment.student.user.email,
                avatar: enrollment.student.user.avatar,
                phone: enrollment.student.user.phone,
                course: enrollment.student.course.name,
                semester: enrollment.student.currentSemester,
                gpa: enrollment.student.gpa,
                attendancePercentage,
                totalClasses,
                presentCount,
                assignmentCompletion,
                finalGrade: enrollment.finalGrade,
            };
        });

        res.json({
            success: true,
            data: studentsWithStats,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/lecturer/subjects/:id/syllabus-status
 * Toggle syllabus completion status
 */
router.put('/:id/syllabus-status', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { syllabusCompleted } = req.body;

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
                id,
                lecturerId: lecturer.id,
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Update syllabus status
        const updatedSubject = await prisma.subject.update({
            where: { id },
            data: { syllabusCompleted: Boolean(syllabusCompleted) },
        });

        res.json({
            success: true,
            message: syllabusCompleted ? 'Syllabus marked as completed' : 'Syllabus marked as in progress',
            data: {
                syllabusCompleted: updatedSubject.syllabusCompleted,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/subjects/:id/notes
 * Get notes for a subject
 */
router.get('/:id/notes', async (req: Request, res: Response, next: NextFunction) => {
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

        // Verify subject belongs to lecturer
        const subject = await prisma.subject.findFirst({
            where: {
                id,
                lecturerId: lecturer.id,
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Get notes for this subject
        const notes = await prisma.note.findMany({
            where: { subjectId: id },
            include: {
                uploader: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: notes.map(note => ({
                id: note.id,
                title: note.title,
                description: note.description,
                type: note.noteType,
                fileUrl: note.fileUrl,
                fileName: note.fileName,
                fileSize: note.fileSize,
                isPublic: note.isPublic,
                uploadedBy: `${note.uploader.firstName} ${note.uploader.lastName}`,
                createdAt: note.createdAt,
            })),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/lecturer/subjects/:id/notes
 * Add a note to a subject (supports PDF upload)
 */
router.post('/:id/notes', noteUpload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { title, description, isPublic } = req.body;

        if (!title) {
            throw new NotFoundError('Title is required');
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
                id,
                lecturerId: lecturer.id,
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Handle file upload if present
        const file = req.file;
        const fileUrl = file ? getFileUrl(file.filename) : '';
        const fileName = file ? file.originalname : '';
        const fileSize = file ? file.size : 0;
        const mimeType = file ? file.mimetype : 'text/plain';

        // Create note
        const note = await prisma.note.create({
            data: {
                title,
                description: description || '',
                subjectId: id,
                uploadedBy: userId,
                noteType: 'COURSE_MATERIAL',
                fileUrl,
                fileName,
                fileSize,
                mimeType,
                isPublic: isPublic === 'true' || isPublic === true,
            },
        });

        res.json({
            success: true,
            message: file ? 'Note with PDF uploaded successfully' : 'Note added successfully',
            data: {
                id: note.id,
                title: note.title,
                description: note.description,
                fileUrl: note.fileUrl,
                fileName: note.fileName,
                isPublic: note.isPublic,
                createdAt: note.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/lecturer/subjects/:subjectId/notes/:noteId
 * Delete a note
 */
router.delete('/:subjectId/notes/:noteId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId, noteId } = req.params;

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

        // Delete note
        await prisma.note.delete({
            where: { id: noteId },
        });

        res.json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
