import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/layout/Layout";

import {
    getSubject,
    getStudents,
    getAttendance,
    saveAttendance,
} from "../../services/attendanceService";

export default function Attendance() {
    const { subjectId } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        loadAttendancePage();
    }, []);

    async function loadAttendancePage() {
        try {
            setLoading(true);

            const subjectResponse = await getSubject(subjectId);

            if (subjectResponse.error) {
                throw subjectResponse.error;
            }

            setSubject(subjectResponse.data);

            const studentsResponse = await getStudents(
                subjectResponse.data.section_id
            );

            if (studentsResponse.error) {
                throw studentsResponse.error;
            }

            // Load today's attendance
            const attendanceResponse = await getAttendance(
                subjectId,
                today
            );

            if (attendanceResponse.error) {
                throw attendanceResponse.error;
            }

            const attendanceMap = {};

            attendanceResponse.data.forEach((record) => {
                attendanceMap[record.student_id] = record.status;
            });

            const attendanceStudents =
                studentsResponse.data.map((student) => ({
                    ...student,
                    attendanceStatus:
                        attendanceMap[student.id] ?? "present",
                }));

            setStudents(attendanceStudents);
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.message ??
                "Unable to load attendance."
            );
        } finally {
            setLoading(false);
        }
    }

    function changeAttendance(studentId, status) {
        setStudents((previous) =>
            previous.map((student) =>
                student.id === studentId
                    ? {
                        ...student,
                        attendanceStatus: status,
                    }
                    : student
            )
        );
    }

    async function handleSaveAttendance() {
        try {
            setSaving(true);

            const records = students.map((student) => ({
                student_id: student.id,
                subject_id: subject.id,
                teacher_id: subject.teacher_id,
                attendance_date: today,
                status: student.attendanceStatus,
            }));

            const { error } =
                await saveAttendance(records);

            if (error) {
                throw error;
            }

            alert("Attendance saved successfully.");

            navigate("/teacher/dashboard");
        } catch (error) {
            console.error(error);

            setErrorMessage(
                error.message ??
                "Unable to save attendance."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Layout>
                <div className="py-20 text-center text-lg">
                    Loading attendance...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        {subject.subject_name}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {subject.sections?.courses?.code}
                        {" • "}
                        Year {subject.sections?.year_level}
                        {" - "}
                        {subject.sections?.section_name}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        Attendance Date:
                        {" "}
                        {today}
                    </p>
                </div>

            </div>

            {errorMessage && (
                <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
                    {errorMessage}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                <table className="min-w-full">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="px-5 py-4 text-left">
                                Student Number
                            </th>

                            <th className="px-5 py-4 text-left">
                                Student Name
                            </th>

                            <th className="px-5 py-4 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="py-10 text-center text-gray-500"
                                >
                                    No students found in this section.
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        {student.student_number}
                                    </td>

                                    <td className="px-5 py-4 font-medium">
                                        {student.full_name}
                                    </td>

                                    <td className="px-5 py-4">
                                        <select
                                            value={student.attendanceStatus}
                                            onChange={(e) =>
                                                changeAttendance(
                                                    student.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border p-2"
                                        >
                                            <option value="present">
                                                Present
                                            </option>

                                            <option value="late">
                                                Late
                                            </option>

                                            <option value="absent">
                                                Absent
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() => navigate("/teacher/dashboard")}
                    className="rounded-lg border px-6 py-3 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveAttendance}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : "Save Attendance"}
                </button>

            </div>

        </Layout>
    );
}