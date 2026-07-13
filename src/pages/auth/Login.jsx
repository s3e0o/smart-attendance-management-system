import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Student Attendance System
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-3"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg p-3"
              placeholder="Enter your password"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
                to="/register"
                className="font-medium text-blue-600 hover:underline"
            >
                Register
            </Link>
            </p>
        </form>
      </div>
    </div>
  );
}