import { NavLink, useNavigate } from "react-router-dom";
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

import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdDashboard size={22} />,
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: <MdPeople size={22} />,
    },
    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: <MdClass size={22} />,
    },
    {
      name: "Subjects",
      path: "/admin/subjects",
      icon: <MdMenuBook size={22} />,
    },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: <MdChecklist size={22} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <MdAssessment size={22} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <MdSettings size={22} />,
    },
  ];

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 min-h-screen w-64 bg-slate-900 text-white">

      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold">
          Smart AMS
        </h1>

        <p className="text-sm text-gray-400">
          Attendance Management
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
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

      <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800"
        >
          <MdLogout size={22} />

          Logout
        </button>

      </div>

    </aside>
  );
}