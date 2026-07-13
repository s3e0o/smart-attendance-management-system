import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      // Login to Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Logged in user:", data.user);

      // Get profile from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      console.log("User Profile:", profile);

      // Redirect according to role
      switch (profile.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "teacher":
          navigate("/teacher/dashboard");
          break;

        case "student":
          navigate("/student/dashboard");
          break;

        default:
          setErrorMessage("Unknown user role.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Smart Attendance Management System
        </h1>

        {errorMessage && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-2 block">Email</label>
            <input
              type="email"
              className="w-full rounded border p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block">Password</label>
            <input
              type="password"
              className="w-full rounded border p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}