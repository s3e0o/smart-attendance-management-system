import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdClass,
  MdMenuBook,
  MdChecklist,
  MdAssessment,
  MdSettings,
  MdLogout,
} from "react-icons/md";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard size={22} /> },
    { name: "Students", path: "/admin/students", icon: <MdPeople size={22} /> },
    { name: "Teachers", path: "/admin/teachers", icon: <MdClass size={22} /> },
    { name: "Subjects", path: "/admin/subjects", icon: <MdMenuBook size={22} /> },
    { name: "Attendance", path: "/admin/attendance", icon: <MdChecklist size={22} /> },
    { name: "Reports", path: "/admin/reports", icon: <MdAssessment size={22} /> },
    { name: "Settings", path: "/admin/settings", icon: <MdSettings size={22} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">Smart AMS</h1>
        <p className="text-sm text-gray-400">
          Attendance Management
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-800 rounded-lg">
          <MdLogout size={22} />
          Logout
        </button>
      </div>
    </aside>
  );
}