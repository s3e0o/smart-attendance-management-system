import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import Teachers from "./pages/admin/Teachers";
import Subjects from "./pages/admin/Subjects";
import TeacherAttendance from "./pages/teacher/Attendance";
import Students from "./pages/admin/Students";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      <Route
        path="/admin/students"
        element={<Students />}
      />

      <Route
        path="/admin/teachers"
        element={<Teachers />}
      />

      <Route
        path="/admin/subjects"
        element={<Subjects />}
      />

      <Route
        path="/teacher/attendance/:subjectId"
        element={<TeacherAttendance />}
      />

    </Routes>

  );
}