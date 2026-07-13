import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-10">
        Dashboard
      </h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/students">Students</Link>
        <Link to="/teachers">Teachers</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </aside>
  );
}