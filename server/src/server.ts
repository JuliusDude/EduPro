import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

// Import routes
import authRoutes from './routes/auth';
import studentDashboardRoutes from './routes/student/dashboard';
import studentAttendanceRoutes from './routes/student/attendance';
import studentAssignmentsRoutes from './routes/student/assignments';
import studentNotesRoutes from './routes/student/notes';
import studentTimetableRoutes from './routes/student/timetable';
import studentCoursesRoutes from './routes/student/courses';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting (relaxed for development)
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // 1000 requests per minute for dev
    message: 'Too many requests from this IP, please try again later.',
    skip: () => process.env.NODE_ENV === 'development', // Skip rate limiting in development
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(morgan('dev')); // HTTP request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/api', limiter); // Apply rate limiting to API routes

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// Student routes
app.use('/api/student/dashboard', studentDashboardRoutes);
app.use('/api/student/attendance', studentAttendanceRoutes);
app.use('/api/student/assignments', studentAssignmentsRoutes);
app.use('/api/student/notes', studentNotesRoutes);
app.use('/api/student/timetable', studentTimetableRoutes);
app.use('/api/student/courses', studentCoursesRoutes);

// Admin routes
import adminDashboardRoutes from './routes/admin/dashboard';
import adminUserRoutes from './routes/admin/users';
import adminCourseRoutes from './routes/admin/courses';
import adminDepartmentRoutes from './routes/admin/departments';
import adminEventRoutes from './routes/admin/events';
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/courses', adminCourseRoutes);
app.use('/api/admin/departments', adminDepartmentRoutes);
app.use('/api/admin/events', adminEventRoutes);

// Lecturer routes
import lecturerDashboardRoutes from './routes/lecturer/dashboard';
import lecturerSubjectsRoutes from './routes/lecturer/subjects';
import lecturerAttendanceRoutes from './routes/lecturer/attendance';
import lecturerAssignmentsRoutes from './routes/lecturer/assignments';
import lecturerStudentsRoutes from './routes/lecturer/students';
import lecturerTimetableRoutes from './routes/lecturer/timetable';
app.use('/api/lecturer/dashboard', lecturerDashboardRoutes);
app.use('/api/lecturer/subjects', lecturerSubjectsRoutes);
app.use('/api/lecturer/attendance', lecturerAttendanceRoutes);
app.use('/api/lecturer/assignments', lecturerAssignmentsRoutes);
app.use('/api/lecturer/students', lecturerStudentsRoutes);
app.use('/api/lecturer/timetable', lecturerTimetableRoutes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

export default app;
