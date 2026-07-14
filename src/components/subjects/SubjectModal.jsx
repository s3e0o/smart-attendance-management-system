import { useEffect, useState } from "react";

import { supabase } from "../../services/supabaseClient";

import {
  createSubject,
  updateSubject,
} from "../../services/subjectService";

export default function SubjectModal({
  isOpen,
  onClose,
  subject,
}) {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [teacher, setTeacher] = useState("");
  const [units, setUnits] = useState("3");
  const [status, setStatus] = useState("Active");

  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
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

    if (!course) {
      setSections([]);
      setTeachers([]);
      setSection("");
      setTeacher("");
      return;
    }

    fetchCourseOptions(course);
  }, [course, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (subject) {
      const selectedCourseId =
        subject.sections?.course_id?.toString() ?? "";

      setSubjectCode(subject.subject_code ?? "");
      setSubjectName(subject.subject_name ?? "");
      setCourse(selectedCourseId);
      setSection(subject.section_id?.toString() ?? "");
      setTeacher(subject.teacher_id?.toString() ?? "");
      setUnits(subject.units?.toString() ?? "3");

      setStatus(
        subject.status
          ? subject.status.charAt(0).toUpperCase() +
              subject.status.slice(1)
          : "Active"
      );
    } else {
      resetForm();
    }
  }, [subject, isOpen]);

  async function fetchCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("id, code, name")
      .order("code", { ascending: true });

    if (error) {
      console.error(error);
      setErrorMessage("Unable to load courses.");
      return;
    }

    setCourses(data ?? []);
  }

  async function fetchCourseOptions(courseId) {
    try {
      setLoadingOptions(true);

      const [sectionsResponse, teachersResponse] =
        await Promise.all([
          supabase
            .from("sections")
            .select("id, course_id, year_level, section_name")
            .eq("course_id", courseId)
            .order("year_level", { ascending: true })
            .order("section_name", { ascending: true }),

          supabase
            .from("teachers")
            .select("id, full_name, employee_number, status")
            .eq("course_id", courseId)
            .eq("status", "active")
            .order("full_name", { ascending: true }),
        ]);

      if (sectionsResponse.error) {
        throw sectionsResponse.error;
      }

      if (teachersResponse.error) {
        throw teachersResponse.error;
      }

      setSections(sectionsResponse.data ?? []);
      setTeachers(teachersResponse.data ?? []);

      if (
        section &&
        !sectionsResponse.data?.some(
          (item) => item.id.toString() === section.toString()
        )
      ) {
        setSection("");
      }

      if (
        teacher &&
        !teachersResponse.data?.some(
          (item) => item.id.toString() === teacher.toString()
        )
      ) {
        setTeacher("");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message || "Unable to load sections and teachers."
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  function resetForm() {
    setSubjectCode("");
    setSubjectName("");
    setCourse("");
    setSection("");
    setTeacher("");
    setUnits("3");
    setStatus("Active");
    setSections([]);
    setTeachers([]);
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
      !subjectCode.trim() ||
      !subjectName.trim() ||
      !course ||
      !section ||
      !teacher ||
      !units
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const parsedUnits = Number(units);

    if (
      !Number.isInteger(parsedUnits) ||
      parsedUnits < 1
    ) {
      setErrorMessage(
        "Units must be a whole number greater than zero."
      );
      return;
    }

    const subjectData = {
      subject_code: subjectCode.trim().toUpperCase(),
      subject_name: subjectName.trim(),
      teacher_id: Number(teacher),
      section_id: Number(section),
      units: parsedUnits,
      status: status.toLowerCase(),
    };

    try {
      setLoading(true);

      const response = subject
        ? await updateSubject(subject.id, subjectData)
        : await createSubject(subjectData);

      if (response.error) {
        throw response.error;
      }

      closeModal();
    } catch (error) {
      console.error(error);

      if (error.code === "23505") {
        setErrorMessage(
          "That subject code is already being used."
        );
      } else {
        setErrorMessage(
          error.message || "Unable to save subject."
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
            {subject ? "Edit Subject" : "Add Subject"}
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
              htmlFor="subjectCode"
              className="mb-2 block font-medium"
            >
              Subject Code
            </label>

            <input
              id="subjectCode"
              type="text"
              value={subjectCode}
              onChange={(event) =>
                setSubjectCode(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="IT101"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subjectName"
              className="mb-2 block font-medium"
            >
              Subject Name
            </label>

            <input
              id="subjectName"
              type="text"
              value={subjectName}
              onChange={(event) =>
                setSubjectName(event.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Introduction to Programming"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subjectCourse"
              className="mb-2 block font-medium"
            >
              Course
            </label>

            <select
              id="subjectCourse"
              value={course}
              onChange={(event) => {
                setCourse(event.target.value);
                setSection("");
                setTeacher("");
              }}
              className="w-full rounded-lg border p-3"
              required
            >
              <option value="">Select Course</option>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="subjectSection"
                className="mb-2 block font-medium"
              >
                Section
              </label>

              <select
                id="subjectSection"
                value={section}
                onChange={(event) =>
                  setSection(event.target.value)
                }
                className="w-full rounded-lg border p-3 disabled:bg-gray-100"
                disabled={!course || loadingOptions}
                required
              >
                <option value="">
                  {!course
                    ? "Select Course First"
                    : loadingOptions
                      ? "Loading..."
                      : "Select Section"}
                </option>

                {sections.map((sectionItem) => (
                  <option
                    key={sectionItem.id}
                    value={sectionItem.id}
                  >
                    Year {sectionItem.year_level} -{" "}
                    {sectionItem.section_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="subjectTeacher"
                className="mb-2 block font-medium"
              >
                Teacher
              </label>

              <select
                id="subjectTeacher"
                value={teacher}
                onChange={(event) =>
                  setTeacher(event.target.value)
                }
                className="w-full rounded-lg border p-3 disabled:bg-gray-100"
                disabled={!course || loadingOptions}
                required
              >
                <option value="">
                  {!course
                    ? "Select Course First"
                    : loadingOptions
                      ? "Loading..."
                      : "Select Teacher"}
                </option>

                {teachers.map((teacherItem) => (
                  <option
                    key={teacherItem.id}
                    value={teacherItem.id}
                  >
                    {teacherItem.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {course &&
            !loadingOptions &&
            sections.length === 0 && (
              <p className="text-sm text-amber-600">
                This course does not have any sections yet.
              </p>
            )}

          {course &&
            !loadingOptions &&
            teachers.length === 0 && (
              <p className="text-sm text-amber-600">
                This course does not have any active teachers
                assigned yet.
              </p>
            )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="subjectUnits"
                className="mb-2 block font-medium"
              >
                Units
              </label>

              <input
                id="subjectUnits"
                type="number"
                min="1"
                step="1"
                value={units}
                onChange={(event) =>
                  setUnits(event.target.value)
                }
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subjectStatus"
                className="mb-2 block font-medium"
              >
                Status
              </label>

              <select
                id="subjectStatus"
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
              disabled={loading || loadingOptions}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : subject
                  ? "Save Changes"
                  : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}