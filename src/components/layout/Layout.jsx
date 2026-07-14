import AdminSidebar from "./AdminSidebar";
import TeacherSidebar from "./TeacherSidebar";
import Navbar from "./Navbar";

import { useAuth } from "../../context/AuthContext";

export default function Layout({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  let SidebarComponent = null;

  switch (profile?.role) {
    case "admin":
      SidebarComponent = <AdminSidebar />;
      break;

    case "teacher":
      SidebarComponent = <TeacherSidebar />;
      break;

    default:
      SidebarComponent = null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {SidebarComponent}

      <div
        className={`flex-1 ${
          profile ? "ml-64" : ""
        }`}
      >
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>

    </div>
  );
}