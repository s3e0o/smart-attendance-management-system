import { useEffect, useState } from "react";

import { supabase } from "../../services/supabaseClient";

import {
  createTeacher,
  updateTeacher,
} from "../../services/teacherService";

export default function TeacherModal({
  isOpen,
  onClose,
  teacher,
}) {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("Active");

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    fetchCourses();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (teacher) {
      setEmployeeNumber(teacher.employee_number ?? "");
      setFullName(teacher.full_name ?? "");
      setEmail(teacher.email ?? "");
      setDepartment(teacher.department ?? "");
      setCourse(teacher.course_id?.toString() ?? "");

      setStatus(
        teacher.status
          ? teacher.status.charAt(0).toUpperCase() +
              teacher.status.slice(1)
          : "Active"
      );
    } else {
      resetForm();
    }
  }, [teacher, isOpen]);

  async function fetchCourses() {
    try {
      setLoadingCourses(true);

      const { data, error } = await supabase
        .from("courses")
        .select("id, code, name")
        .order("code", { ascending: true });

      if (error) {
        throw error;
      }

      setCourses(data ?? []);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message || "Unable to load courses."
      );
    } finally {
      setLoadingCourses(false);
    }
  }

  function resetForm() {
    setEmployeeNumber("");
    setFullName("");
    setEmail("");
    setDepartment("");
    setCourse("");
    setStatus("Active");
    setErrorMessage("");
  }

  function closeModal() {
    resetForm();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");

    if (
      !employeeNumber.trim() ||
      !fullName.trim() ||
      !email.trim() ||
      !department.trim() ||
      !course
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const teacherData = {
      employee_number: employeeNumber.trim(),
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      course_id: Number(course),
      status: status.toLowerCase(),
    };

    try {
      setLoading(true);

      const response = teacher
        ? await updateTeacher(teacher.id, teacherData)
        : await createTeacher(teacherData);

      if (response.error) {
        throw response.error;
      }

      closeModal();
    } catch (error) {
      console.error(error);

      if (error.code === "23505") {
        setErrorMessage(
          "The employee number or email is already being used."
        );
      } else {
        setErrorMessage(
          error.message || "Unable to save teacher."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {teacher ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="text-2xl text-gray-500 hover:text-black"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="employeeNumber"
              className="mb-2 block font-medium"
            >
              Employee Number
            </label>

            <input
              id="employeeNumber"
              type="text"
              value={employeeNumber}
              onChange={(event) =>
                setEmployeeNumber(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="EMP-2026-001"
              required
            />
          </div>

          <div>
            <label
              htmlFor="teacherFullName"
              className="mb-2 block font-medium"
            >
              Full Name
            </label>

            <input
              id="teacherFullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Maria Santos"
              required
            />
          </div>

          <div>
            <label
              htmlFor="teacherEmail"
              className="mb-2 block font-medium"
            >
              Email
            </label>

            <input
              id="teacherEmail"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="maria@school.edu"
              required
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-2 block font-medium"
            >
              Department
            </label>

            <input
              id="department"
              type="text"
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Information Technology"
              required
            />
          </div>

          <div>
            <label
              htmlFor="teacherCourse"
              className="mb-2 block font-medium"
            >
              Course
            </label>

            <select
              id="teacherCourse"
              value={course}
              onChange={(event) =>
                setCourse(event.target.value)
              }
              className="w-full rounded-lg border p-3 disabled:bg-gray-100"
              disabled={loadingCourses}
              required
            >
              <option value="">
                {loadingCourses
                  ? "Loading courses..."
                  : "Select Course"}
              </option>

              {courses.map((courseItem) => (
                <option
                  key={courseItem.id}
                  value={courseItem.id}
                >
                  {courseItem.code} — {courseItem.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="teacherStatus"
              className="mb-2 block font-medium"
            >
              Status
            </label>

            <select
              id="teacherStatus"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border px-5 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || loadingCourses}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : teacher
                  ? "Save Changes"
                  : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}