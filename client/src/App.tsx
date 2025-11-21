import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import RoleGuard from './components/RoleGuard';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import Login from './pages/Login';
import CourseInfo from './pages/CourseInfo';
import Timetable from './pages/Timetable';

// Lecturer pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerAttendance from './pages/lecturer/LecturerAttendance';
import LecturerCourses from './pages/lecturer/LecturerCourses';
import LecturerCourseDetails from './pages/lecturer/LecturerCourseDetails';
import LecturerAssignments from './pages/lecturer/LecturerAssignments';
import LecturerAssignmentDetails from './pages/lecturer/LecturerAssignmentDetails';
import LecturerStudents from './pages/lecturer/LecturerStudents';
import LecturerAnnouncements from './pages/lecturer/LecturerAnnouncements';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminReports from './pages/admin/AdminReports';

function App() {
  const { isAuthenticated, user } = useAuth();

  // Redirect to role-specific dashboard
  const getRoleHomePage = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'lecturer':
        return '/lecturer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={getRoleHomePage()} /> : <Login />
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <RoleGuard allowedRoles={['student']}>
          <Layout role="student">
            <Outlet />
          </Layout>
        </RoleGuard>
      }>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="courses" element={<CourseInfo />} />
        <Route path="notes" element={<Notes />} />
      </Route>

      {/* Root Redirect */}
      <Route path="/" element={
        isAuthenticated ? (
          user?.role === 'student' ? <Navigate to="/student/dashboard" replace /> :
            user?.role === 'lecturer' ? <Navigate to="/lecturer/dashboard" replace /> :
              user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> :
                <Navigate to="/login" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* Lecturer Routes */}
      <Route path="/lecturer" element={
        <RoleGuard allowedRoles={['lecturer']}>
          <Layout role="lecturer">
            <Outlet />
          </Layout>
        </RoleGuard>
      }>
        <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
        <Route path="dashboard" element={<LecturerDashboard />} />
        <Route path="courses" element={<LecturerCourses />} />
        <Route path="courses/:id" element={<LecturerCourseDetails />} />
        <Route path="attendance" element={<LecturerAttendance />} />
        <Route path="assignments" element={<LecturerAssignments />} />
        <Route path="assignments/:id" element={<LecturerAssignmentDetails />} />
        <Route path="students" element={<LecturerStudents />} />
        <Route path="announcements" element={<LecturerAnnouncements />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <RoleGuard allowedRoles={['admin']}>
          <Layout role="admin">
            <Outlet />
          </Layout>
        </RoleGuard>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? getRoleHomePage() : '/login'} />} />
    </Routes>
  );
}

export default App;
