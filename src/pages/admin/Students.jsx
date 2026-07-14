import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";
import StudentTable from "../../components/students/StudentTable";
import StudentModal from "../../components/students/StudentModal";

import { getStudents, deleteStudent } from "../../services/studentService";

export default function Students() {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        const { data, error } = await getStudents();

        if (error) {
            console.error(error);
            return;
        }

        setStudents(data);
    }

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            const keyword = search.toLowerCase();

            return (
                student.student_number.toLowerCase().includes(keyword) ||
                student.full_name.toLowerCase().includes(keyword) ||
                student.email.toLowerCase().includes(keyword)
            );
        });
    }, [students, search]);

    function handleAddStudent() {
        setSelectedStudent(null);
        setOpenModal(true);
    }

    function handleEditStudent(student) {
        setSelectedStudent(student);
        setOpenModal(true);
    }

    function handleCloseModal() {
        setOpenModal(false);
        setSelectedStudent(null);
        fetchStudents();
    }

    async function handleDelete(student) {
        const confirmed = window.confirm(
            `Delete ${student.full_name}?`
        );

        if (!confirmed) return;

        const { error } = await deleteStudent(student.id);

        if (error) {
            console.error(error);
            return;
        }

        fetchStudents();
    }

    return (
        <Layout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Students</h1>

                    <p className="text-gray-500">
                        Manage all student records.
                    </p>
                </div>

                <button
                    onClick={handleAddStudent}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                >
                    + Add Student
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />
            </div>

            <StudentTable
                students={filteredStudents}
                onEdit={(student) => {
                    setSelectedStudent(student);
                    setOpenModal(true);
                }}
                onDelete={handleDelete}
            />

            <StudentModal
                isOpen={openModal}
                student={selectedStudent}
                onClose={handleCloseModal}
            />
        </Layout>
    );
}