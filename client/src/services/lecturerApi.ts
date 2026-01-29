import api from './api';

// Types
export interface DashboardData {
    stats: {
        totalSubjects: number;
        totalStudents: number;
        pendingGrading: number;
        activeAssignments: number;
    };
    todaySchedule: {
        id: string;
        time: string;
        subject: string;
        subjectCode: string;
        course: string;
        type: string;
        room: string | null;
    }[];
    pendingSubmissions: {
        id: string;
        student: string;
        assignment: string;
        subject: string;
        submittedAt: string;
    }[];
    recentAssignments: {
        id: string;
        title: string;
        subject: string;
        dueDate: string;
        status: string;
        totalSubmissions: number;
        gradedSubmissions: number;
    }[];
}

export interface Subject {
    id: string;
    code: string;
    name: string;
    course: string;
    department: string;
    semester: number;
    weeklyHours: number;
    totalHours: number;
    roomNumber: string | null;
    enrolledStudents: number;
    totalClasses: number;
    averageAttendance: number;
    totalAssignments: number;
    activeAssignments: number;
}

export interface Student {
    id: string;
    userId: string;
    studentNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    course: string;
    semester: number;
    gpa: number | null;
    subjects: {
        id: string;
        name: string;
        code: string;
        attendancePercentage: number;
    }[];
    overallAttendance: number;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    subject: {
        id: string;
        name: string;
        code: string;
        course: string;
    };
    dueDate: string;
    totalMarks: number;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    attachments: any[];
    createdAt: string;
    updatedAt: string;
    stats: {
        totalSubmissions: number;
        gradedSubmissions: number;
        lateSubmissions: number;
        pendingGrading: number;
        averageGrade: number | null;
    };
}

export interface AttendanceStats {
    enrollmentId: string;
    studentId: string;
    studentName: string;
    studentNumber: string;
    totalClasses: number;
    present: number;
    absent: number;
    excused: number;
    percentage: number;
}

export interface TimetableDay {
    day: string;
    slots: {
        id: string;
        startTime: string;
        endTime: string;
        subject: {
            id: string;
            name: string;
            code: string;
            course: string;
        };
        room: string | null;
        type: string;
        enrolledStudents: number;
    }[];
}

// API Functions
export const lecturerApi = {
    // Dashboard
    getDashboard: async (): Promise<DashboardData> => {
        const response = await api.get('/lecturer/dashboard');
        return response.data.data;
    },

    // Subjects
    getSubjects: async (): Promise<Subject[]> => {
        const response = await api.get('/lecturer/subjects');
        return response.data.data;
    },

    getSubjectById: async (id: string) => {
        const response = await api.get(`/lecturer/subjects/${id}`);
        return response.data.data;
    },

    getSubjectStudents: async (id: string) => {
        const response = await api.get(`/lecturer/subjects/${id}/students`);
        return response.data.data;
    },

    toggleSyllabusStatus: async (subjectId: string, completed: boolean) => {
        const response = await api.put(`/lecturer/subjects/${subjectId}/syllabus-status`, {
            syllabusCompleted: completed
        });
        return response.data;
    },

    getSubjectNotes: async (subjectId: string) => {
        const response = await api.get(`/lecturer/subjects/${subjectId}/notes`);
        return response.data.data;
    },

    addSubjectNote: async (subjectId: string, data: { title: string; description: string; isPublic: boolean; file?: File }) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('isPublic', String(data.isPublic));
        if (data.file) {
            formData.append('file', data.file);
        }
        const response = await api.post(`/lecturer/subjects/${subjectId}/notes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteSubjectNote: async (subjectId: string, noteId: string) => {
        const response = await api.delete(`/lecturer/subjects/${subjectId}/notes/${noteId}`);
        return response.data;
    },

    // Students
    getStudents: async (subjectId?: string): Promise<Student[]> => {
        const params = subjectId ? { subjectId } : {};
        const response = await api.get('/lecturer/students', { params });
        return response.data.data;
    },

    getStudentById: async (id: string) => {
        const response = await api.get(`/lecturer/students/${id}`);
        return response.data.data;
    },

    getStudentPerformance: async (id: string) => {
        const response = await api.get(`/lecturer/students/${id}/performance`);
        return response.data.data;
    },

    // Attendance
    getAttendance: async (subjectId: string): Promise<{ subject: any; attendanceStats: AttendanceStats[] }> => {
        const response = await api.get(`/lecturer/attendance/subjects/${subjectId}`);
        return response.data.data;
    },

    markAttendance: async (data: {
        subjectId: string;
        date: string;
        attendanceRecords: {
            enrollmentId: string;
            studentId: string;
            status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
            remarks?: string;
        }[];
    }) => {
        const response = await api.post('/lecturer/attendance/mark', data);
        return response.data;
    },

    updateAttendance: async (id: string, data: { status: string; remarks?: string }) => {
        const response = await api.put(`/lecturer/attendance/${id}`, data);
        return response.data;
    },

    markSingleAttendance: async (data: {
        subjectId: string;
        enrollmentId: string;
        studentId: string;
        status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    }) => {
        const response = await api.post('/lecturer/attendance/mark-single', data);
        return response.data;
    },

    getAttendanceSessions: async (subjectId?: string) => {
        const params = subjectId ? { subjectId } : {};
        const response = await api.get('/lecturer/attendance/sessions', { params });
        return response.data.data;
    },

    // Assignments
    getAssignments: async (params?: { subjectId?: string; status?: string }): Promise<Assignment[]> => {
        const response = await api.get('/lecturer/assignments', { params });
        return response.data.data;
    },

    createAssignment: async (data: {
        title: string;
        description: string;
        subjectId: string;
        dueDate: string;
        totalMarks: number;
        attachments?: any[];
        status?: 'DRAFT' | 'PUBLISHED';
    }) => {
        const response = await api.post('/lecturer/assignments', data);
        return response.data;
    },

    updateAssignment: async (id: string, data: Partial<{
        title: string;
        description: string;
        dueDate: string;
        totalMarks: number;
        attachments: any[];
        status: string;
    }>) => {
        const response = await api.put(`/lecturer/assignments/${id}`, data);
        return response.data;
    },

    deleteAssignment: async (id: string) => {
        const response = await api.delete(`/lecturer/assignments/${id}`);
        return response.data;
    },

    getSubmissions: async (assignmentId: string, status?: string) => {
        const params = status ? { status } : {};
        const response = await api.get(`/lecturer/assignments/${assignmentId}/submissions`, { params });
        return response.data.data;
    },

    gradeSubmission: async (submissionId: string, data: { grade: number; feedback?: string }) => {
        const response = await api.put(`/lecturer/assignments/submissions/${submissionId}/grade`, data);
        return response.data;
    },

    // Timetable
    getTimetable: async (): Promise<TimetableDay[]> => {
        const response = await api.get('/lecturer/timetable');
        return response.data.data;
    },

    getTodaySchedule: async () => {
        const response = await api.get('/lecturer/timetable/today');
        return response.data.data;
    },
};

export default lecturerApi;
