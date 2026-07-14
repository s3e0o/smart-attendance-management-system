import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { createStudent, updateStudent, } from "../../services/studentService";

export default function StudentModal({ isOpen, onClose, student }) {
    const [studentNumber, setStudentNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [section, setSection] = useState("");
    const [status, setStatus] = useState("Active");

    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    useEffect(() => {
        if (course) {
            fetchSections(course);
        } else {
            setSections([]);
            setSection("");
        }
    }, [course]);

    useEffect(() => {
        if (!isOpen) return;

        if (student) {
            // Edit Mode
            setStudentNumber(student.student_number || "");
            setFullName(student.full_name || "");
            setEmail(student.email || "");
            setCourse(student.course_id || "");
            setSection(student.section_id || "");
            setStatus(
                student.status
                    ? student.status.charAt(0).toUpperCase() +
                    student.status.slice(1)
                    : "Active"
            );
        } else {
            // Add Mode - Reset Form
            setStudentNumber("");
            setFullName("");
            setEmail("");
            setCourse("");
            setSection("");
            setStatus("Active");
            setSections([]);
        }

        setErrorMessage("");
    }, [student, isOpen]);

    async function fetchCourses() {
        const { data, error } = await supabase
            .from("courses")
            .select("*")
            .order("code");

        if (error) {
            console.error(error);
            return;
        }

        setCourses(data);
    }

    async function fetchSections(courseId) {
        const { data, error } = await supabase
            .from("sections")
            .select("*")
            .eq("course_id", courseId)
            .order("year_level")
            .order("section_name");

        if (error) {
            console.error(error);
            return;
        }

        setSections(data);
    }

    function resetForm() {
        setStudentNumber("");
        setFullName("");
        setEmail("");
        setCourse("");
        setSection("");
        setStatus("Active");
        setErrorMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setErrorMessage("");

        if (
            !studentNumber ||
            !fullName ||
            !email ||
            !course ||
            !section
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const studentData = {
            student_number: studentNumber,
            full_name: fullName,
            email,
            course_id: course,
            section_id: section,
            status: status.toLowerCase(),
        };

        let response;

        if (student) {
            // Edit existing student
            response = await updateStudent(student.id, studentData);
        } else {
            // Create new student
            response = await createStudent(studentData);
        }

        if (response.error) {
            console.error(response.error);
            setErrorMessage(response.error.message);
            return;
        }

        resetForm();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        {student ? "Edit Student" : "Add Student"}
                    </h2>

                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="text-2xl text-gray-500 hover:text-black"
                    >
                        ×
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
                        {errorMessage}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <div>
                        <label className="mb-2 block font-medium">
                            Student Number
                        </label>

                        <input
                            type="text"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            className="w-full rounded-lg border p-3"
                            placeholder="2026-0001"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full rounded-lg border p-3"
                            placeholder="Juan Dela Cruz"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border p-3"
                            placeholder="juan@email.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="mb-2 block font-medium">
                                Course
                            </label>

                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full rounded-lg border p-3"
                            >
                                <option value="">
                                    Select Course
                                </option>

                                {courses.map((courseItem) => (
                                    <option
                                        key={courseItem.id}
                                        value={courseItem.id}
                                    >
                                        {courseItem.code}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Section
                            </label>

                            <select
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                className="w-full rounded-lg border p-3"
                                disabled={!course}
                            >
                                <option value="">
                                    {course
                                        ? "Select Section"
                                        : "Select Course First"}
                                </option>

                                {sections.map((sectionItem) => (
                                    <option
                                        key={sectionItem.id}
                                        value={sectionItem.id}
                                    >
                                        {`Year ${sectionItem.year_level} - ${sectionItem.section_name}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-lg border p-3"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="rounded-lg border px-5 py-3"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        >
                            {student ? "Save Changes" : "Create Student"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}