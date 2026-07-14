import { MdNotificationsNone } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { profile } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  const roleText = profile?.role
    ? profile.role.charAt(0).toUpperCase() +
      profile.role.slice(1)
    : "";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">

      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Smart Attendance Management System
        </h1>

        <p className="text-sm text-gray-500">
          {roleText} Portal
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button
          type="button"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <MdNotificationsNone size={24} />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-semibold text-gray-800">
              {profile?.full_name}
            </p>

            <p className="text-xs text-gray-500">
              {roleText}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}