import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(event) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      console.log("Registered user:", data.user);

      setMessage(
        "Registration successful. Check your email to confirm your account."
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Register for the Smart Attendance System
        </p>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              placeholder="Create a password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-medium text-gray-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
              placeholder="Confirm your password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}