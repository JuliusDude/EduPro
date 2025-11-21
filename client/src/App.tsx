import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
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

function App() {
  const { isAuthenticated, user } = useAuth();

  // Redirect to role-specific dashboard
  const getRoleHomePage = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/';
      case 'lecturer':
        return '/lecturer';
      case 'admin':
        return '/admin';
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
      <Route path="/" element={
        isAuthenticated && user?.role === 'student' ? <Layout /> : <Navigate to="/login" />
      }>
        <Route index element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="courses" element={<CourseInfo />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="notes" element={<Notes />} />
      </Route>

      {/* Lecturer Routes */}
      <Route path="/lecturer" element={
        isAuthenticated && user?.role === 'lecturer' ? <Layout /> : <Navigate to="/login" />
      }>
        <Route index element={<LecturerDashboard />} />
        <Route path="courses" element={<LecturerCourses />} />
        <Route path="courses/:id" element={<LecturerCourseDetails />} />
        <Route path="attendance" element={<LecturerAttendance />} />
        <Route path="assignments" element={<LecturerAssignments />} />
        <Route path="assignments/:id" element={<LecturerAssignmentDetails />} />
        <Route path="students" element={<LecturerStudents />} />
      </Route>

      {/* Admin Routes (placeholder) */}
      <Route path="/admin" element={
        isAuthenticated && user?.role === 'admin' ? <Layout /> : <Navigate to="/login" />
      }>
        <Route index element={<div className="p-8 text-slate-900 dark:text-white">Admin Dashboard - Coming Soon</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? getRoleHomePage() : '/login'} />} />
    </Routes>
  );
}

export default App;
