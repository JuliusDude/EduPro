import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import Login from './pages/Login';
import CourseInfo from './pages/CourseInfo';
import Timetable from './pages/Timetable';

function App() {
  const [isAuthenticated] = useState(true);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="courses" element={<CourseInfo />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="notes" element={<Notes />} />
      </Route>
    </Routes>
  );
}

export default App;
