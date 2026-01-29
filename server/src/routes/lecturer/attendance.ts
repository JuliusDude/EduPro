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
 * GET /api/lecturer/attendance/subjects/:subjectId
 * Get attendance overview for a subject
 */
router.get('/subjects/:subjectId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId } = req.params;

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
            include: {
                enrollments: {
                    where: { status: 'ACTIVE' },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                        attendances: {
                            orderBy: {
                                date: 'desc',
                            },
                        },
                    },
                },
            },
        });

        if (!subject) {
            throw new NotFoundError('Subject not found or access denied');
        }

        // Calculate attendance statistics
        const attendanceStats = subject.enrollments.map((enrollment) => {
            const totalClasses = enrollment.attendances.length;
            const presentCount = enrollment.attendances.filter(
                (att) => att.status === 'PRESENT' || att.status === 'LATE'
            ).length;
            const absentCount = enrollment.attendances.filter(
                (att) => att.status === 'ABSENT'
            ).length;
            const excusedCount = enrollment.attendances.filter(
                (att) => att.status === 'EXCUSED'
            ).length;
            const percentage = totalClasses > 0
                ? Math.round((presentCount / totalClasses) * 100)
                : 0;

            return {
                enrollmentId: enrollment.id,
                studentId: enrollment.student.id,
                studentName: `${enrollment.student.user.firstName} ${enrollment.student.user.lastName}`,
                studentNumber: enrollment.student.studentId,
                totalClasses,
                present: presentCount,
                absent: absentCount,
                excused: excusedCount,
                percentage,
            };
        });

        res.json({
            success: true,
            data: {
                subject: {
                    id: subject.id,
                    name: subject.name,
                    code: subject.code,
                },
                attendanceStats,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/lecturer/attendance/mark
 * Mark attendance for a class session
 */
router.post('/mark', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId, date, attendanceRecords } = req.body;

        // Validate input
        if (!subjectId || !date || !Array.isArray(attendanceRecords)) {
            throw new ValidationError('Subject ID, date, and attendance records are required');
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

        // Parse date
        const attendanceDate = new Date(date);

        // Create attendance records in a transaction
        const createdRecords = await prisma.$transaction(
            attendanceRecords.map((record: any) =>
                prisma.attendance.create({
                    data: {
                        enrollmentId: record.enrollmentId,
                        subjectId,
                        studentId: record.studentId,
                        date: attendanceDate,
                        status: record.status,
                        markedBy: userId,
                        remarks: record.remarks || null,
                    },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                })
            )
        );

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: createdRecords.map((record) => ({
                id: record.id,
                studentName: `${record.student.user.firstName} ${record.student.user.lastName}`,
                status: record.status,
                date: record.date,
            })),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/lecturer/attendance/mark-single
 * Mark attendance for a single student for today (instant)
 * Creates a new attendance record for today if not exists, updates if exists
 */
router.post('/mark-single', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId, enrollmentId, studentId, status } = req.body;

        // Validate input
        if (!subjectId || !enrollmentId || !studentId || !status) {
            throw new ValidationError('Subject ID, enrollment ID, student ID, and status are required');
        }

        if (!['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].includes(status)) {
            throw new ValidationError('Invalid status. Must be PRESENT, ABSENT, LATE, or EXCUSED');
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

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if attendance already exists for today
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                enrollmentId,
                subjectId,
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        let attendance;
        if (existingAttendance) {
            // Update existing attendance
            attendance = await prisma.attendance.update({
                where: { id: existingAttendance.id },
                data: { status },
            });
        } else {
            // Create new attendance for today
            attendance = await prisma.attendance.create({
                data: {
                    enrollmentId,
                    subjectId,
                    studentId,
                    date: today,
                    status,
                    markedBy: userId,
                },
            });
        }

        // Get updated stats for this student in this subject
        const allAttendances = await prisma.attendance.findMany({
            where: {
                enrollmentId,
                subjectId,
            },
        });

        const totalClasses = allAttendances.length;
        const presentCount = allAttendances.filter(
            (att) => att.status === 'PRESENT' || att.status === 'LATE'
        ).length;
        const absentCount = allAttendances.filter(
            (att) => att.status === 'ABSENT'
        ).length;
        const percentage = totalClasses > 0
            ? Math.round((presentCount / totalClasses) * 100)
            : 0;

        res.json({
            success: true,
            message: existingAttendance ? 'Attendance updated for today' : 'Attendance marked for today',
            data: {
                attendanceId: attendance.id,
                status: attendance.status,
                totalClasses,
                present: presentCount,
                absent: absentCount,
                percentage,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/lecturer/attendance/:id
 * Update an attendance record
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const { status, remarks } = req.body;

        // Validate input
        if (!status) {
            throw new ValidationError('Status is required');
        }

        // Get lecturer details
        const lecturer = await prisma.lecturer.findUnique({
            where: { userId },
        });

        if (!lecturer) {
            throw new NotFoundError('Lecturer profile not found');
        }

        // Verify attendance record belongs to lecturer's subject
        const attendance = await prisma.attendance.findFirst({
            where: {
                id,
                subject: {
                    lecturerId: lecturer.id,
                },
            },
        });

        if (!attendance) {
            throw new NotFoundError('Attendance record not found or access denied');
        }

        // Update attendance record
        const updatedAttendance = await prisma.attendance.update({
            where: { id },
            data: {
                status,
                remarks: remarks || null,
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Attendance updated successfully',
            data: {
                id: updatedAttendance.id,
                studentName: `${updatedAttendance.student.user.firstName} ${updatedAttendance.student.user.lastName}`,
                status: updatedAttendance.status,
                date: updatedAttendance.date,
                remarks: updatedAttendance.remarks,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/lecturer/attendance/sessions
 * Get attendance sessions history
 */
router.get('/sessions', async (req: Request, res: Response, next: NextFunction) => {
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
        };

        if (subjectId) {
            whereClause.subjectId = subjectId as string;
        }

        // Get unique attendance dates grouped by subject
        const attendances = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                subject: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        // Group by date and subject
        const sessionsMap = new Map<string, any>();

        attendances.forEach((attendance) => {
            const dateKey = attendance.date.toISOString().split('T')[0];
            const sessionKey = `${dateKey}-${attendance.subjectId}`;

            if (!sessionsMap.has(sessionKey)) {
                sessionsMap.set(sessionKey, {
                    date: attendance.date,
                    subject: {
                        id: attendance.subject.id,
                        name: attendance.subject.name,
                        code: attendance.subject.code,
                    },
                    totalStudents: 0,
                    present: 0,
                    absent: 0,
                    late: 0,
                    excused: 0,
                });
            }

            const session = sessionsMap.get(sessionKey);
            session.totalStudents++;

            switch (attendance.status) {
                case 'PRESENT':
                    session.present++;
                    break;
                case 'ABSENT':
                    session.absent++;
                    break;
                case 'LATE':
                    session.late++;
                    break;
                case 'EXCUSED':
                    session.excused++;
                    break;
            }
        });

        const sessions = Array.from(sessionsMap.values()).map((session) => ({
            ...session,
            attendancePercentage: session.totalStudents > 0
                ? Math.round(((session.present + session.late) / session.totalStudents) * 100)
                : 0,
        }));

        res.json({
            success: true,
            data: sessions,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
