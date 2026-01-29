import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { NotFoundError } from '../../utils/errors';

const router = Router();

// All routes require authentication and lecturer role
router.use(authenticate);
router.use(requireRole('LECTURER'));

/**
 * GET /api/lecturer/students
 * Get all students across lecturer's subjects
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId } = req.query;

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
            status: 'ACTIVE',
        };

        if (subjectId) {
            whereClause.subjectId = subjectId as string;
        }

        // Get all enrollments
        const enrollments = await prisma.enrollment.findMany({
            where: whereClause,
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
                subject: true,
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

        // Group by student and calculate stats
        const studentsMap = new Map<string, any>();

        enrollments.forEach((enrollment) => {
            const studentId = enrollment.student.id;

            if (!studentsMap.has(studentId)) {
                studentsMap.set(studentId, {
                    id: studentId,
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
                    subjects: [],
                    totalClasses: 0,
                    presentCount: 0,
                });
            }

            const student = studentsMap.get(studentId);
            const totalClasses = enrollment.attendances.length;
            const presentCount = enrollment.attendances.filter(
                (att) => att.status === 'PRESENT' || att.status === 'LATE'
            ).length;

            student.subjects.push({
                id: enrollment.subject.id,
                name: enrollment.subject.name,
                code: enrollment.subject.code,
                attendancePercentage: totalClasses > 0
                    ? Math.round((presentCount / totalClasses) * 100)
                    : 0,
            });

            student.totalClasses += totalClasses;
            student.presentCount += presentCount;
        });

        // Calculate overall attendance for each student
        const students = Array.from(studentsMap.values()).map((student) => ({
            ...student,
            overallAttendance: student.totalClasses > 0
                ? Math.round((student.presentCount / student.totalClasses) * 100)
                : 0,
        }));

        res.json({
            success: true,
            data: students,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/students/:id
 * Get detailed student profile
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

        // Get student details
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        phone: true,
                        department: true,
                    },
                },
                course: {
                    include: {
                        department: true,
                    },
                },
                enrollments: {
                    where: {
                        subject: {
                            lecturerId: lecturer.id,
                        },
                        status: 'ACTIVE',
                    },
                    include: {
                        subject: true,
                        attendances: {
                            orderBy: {
                                date: 'desc',
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            throw new NotFoundError('Student not found');
        }

        // Verify student is enrolled in at least one of lecturer's subjects
        if (student.enrollments.length === 0) {
            throw new NotFoundError('Student not found in your subjects');
        }

        // Get submissions for lecturer's assignments
        const submissions = await prisma.submission.findMany({
            where: {
                studentId: student.user.id,
                assignment: {
                    subject: {
                        lecturerId: lecturer.id,
                    },
                },
            },
            include: {
                assignment: {
                    include: {
                        subject: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });

        // Calculate subject-wise performance
        const subjectPerformance = student.enrollments.map((enrollment) => {
            const totalClasses = enrollment.attendances.length;
            const presentCount = enrollment.attendances.filter(
                (att) => att.status === 'PRESENT' || att.status === 'LATE'
            ).length;
            const attendancePercentage = totalClasses > 0
                ? Math.round((presentCount / totalClasses) * 100)
                : 0;

            const subjectSubmissions = submissions.filter(
                (s) => s.assignment.subjectId === enrollment.subject.id
            );
            const gradedSubmissions = subjectSubmissions.filter((s) => s.grade !== null);
            const avgGrade = gradedSubmissions.length > 0
                ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
                : null;

            return {
                subject: {
                    id: enrollment.subject.id,
                    name: enrollment.subject.name,
                    code: enrollment.subject.code,
                },
                attendancePercentage,
                totalClasses,
                presentCount,
                absentCount: enrollment.attendances.filter((att) => att.status === 'ABSENT').length,
                totalSubmissions: subjectSubmissions.length,
                gradedSubmissions: gradedSubmissions.length,
                averageGrade: avgGrade ? Math.round(avgGrade * 100) / 100 : null,
                finalGrade: enrollment.finalGrade,
            };
        });

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    userId: student.user.id,
                    studentNumber: student.studentId,
                    firstName: student.user.firstName,
                    lastName: student.user.lastName,
                    email: student.user.email,
                    avatar: student.user.avatar,
                    phone: student.user.phone,
                    department: student.user.department,
                    course: student.course.name,
                    semester: student.currentSemester,
                    gpa: student.gpa,
                    enrollmentDate: student.enrollmentDate,
                },
                subjectPerformance,
                recentSubmissions: submissions.slice(0, 10).map((submission) => ({
                    id: submission.id,
                    assignment: submission.assignment.title,
                    subject: submission.assignment.subject.name,
                    submittedAt: submission.submittedAt,
                    grade: submission.grade,
                    status: submission.status,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/students/:id/performance
 * Get student performance in lecturer's subjects
 */
router.get('/:id/performance', async (req: Request, res: Response, next: NextFunction) => {
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

        // Get student with enrollments
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                enrollments: {
                    where: {
                        subject: {
                            lecturerId: lecturer.id,
                        },
                        status: 'ACTIVE',
                    },
                    include: {
                        subject: true,
                        attendances: {
                            orderBy: {
                                date: 'asc',
                            },
                        },
                    },
                },
            },
        });

        if (!student || student.enrollments.length === 0) {
            throw new NotFoundError('Student not found in your subjects');
        }

        // Get all assignments and submissions
        const subjectIds = student.enrollments.map((e) => e.subject.id);
        const assignments = await prisma.assignment.findMany({
            where: {
                subjectId: { in: subjectIds },
                status: 'PUBLISHED',
            },
            include: {
                subject: true,
                submissions: {
                    where: {
                        studentId: student.user.id,
                    },
                },
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        // Calculate performance metrics
        const performanceData = student.enrollments.map((enrollment) => {
            // Attendance trend (last 10 classes)
            const recentAttendances = enrollment.attendances.slice(-10);
            const attendanceTrend = recentAttendances.map((att) => ({
                date: att.date,
                status: att.status,
            }));

            // Assignment performance
            const subjectAssignments = assignments.filter(
                (a) => a.subjectId === enrollment.subject.id
            );
            const assignmentPerformance = subjectAssignments.map((assignment) => {
                const submission = assignment.submissions[0];
                return {
                    assignmentId: assignment.id,
                    title: assignment.title,
                    dueDate: assignment.dueDate,
                    totalMarks: assignment.totalMarks,
                    submitted: !!submission,
                    submittedAt: submission?.submittedAt,
                    grade: submission?.grade,
                    percentage: submission?.grade
                        ? Math.round((submission.grade / assignment.totalMarks) * 100)
                        : null,
                    status: submission?.status,
                };
            });

            return {
                subject: {
                    id: enrollment.subject.id,
                    name: enrollment.subject.name,
                    code: enrollment.subject.code,
                },
                attendanceTrend,
                assignmentPerformance,
            };
        });

        res.json({
            success: true,
            data: {
                student: {
                    id: student.id,
                    name: `${student.user.firstName} ${student.user.lastName}`,
                    studentNumber: student.studentId,
                },
                performance: performanceData,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
