import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";
import TeacherTable from "../../components/teachers/TeacherTable";
import TeacherModal from "../../components/teachers/TeacherModal";

import {
  getTeachers,
  deleteTeacher,
} from "../../services/teacherService";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    setErrorMessage("");

    const { data, error } = await getTeachers();

    if (error) {
      console.error(error);
      setErrorMessage("Unable to load teachers.");
      return;
    }

    setTeachers(data ?? []);
  }

  function handleAddTeacher() {
    setSelectedTeacher(null);
    setOpenModal(true);
  }

  function handleEditTeacher(teacher) {
    setSelectedTeacher(teacher);
    setOpenModal(true);
  }

  async function handleDeleteTeacher(teacher) {
    const confirmed = window.confirm(
      `Delete ${teacher.full_name}?`
    );

    if (!confirmed) return;

    const { error } = await deleteTeacher(teacher.id);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }

    fetchTeachers();
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSelectedTeacher(null);

    fetchTeachers();
  }

  const filteredTeachers = useMemo(() => {
    const keyword = search.toLowerCase();

    return teachers.filter((teacher) => {
      return (
        teacher.employee_number
          ?.toLowerCase()
          .includes(keyword) ||

        teacher.full_name
          ?.toLowerCase()
          .includes(keyword) ||

        teacher.email
          ?.toLowerCase()
          .includes(keyword) ||

        teacher.department
          ?.toLowerCase()
          .includes(keyword) ||

        teacher.courses?.code
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [teachers, search]);

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Teachers
          </h1>

          <p className="text-gray-500">
            Manage all teacher records.
          </p>
        </div>

        <button
          onClick={handleAddTeacher}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Teacher
        </button>

      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <TeacherTable
        teachers={filteredTeachers}
        onEdit={handleEditTeacher}
        onDelete={handleDeleteTeacher}
      />

      <TeacherModal
        isOpen={openModal}
        teacher={selectedTeacher}
        onClose={handleCloseModal}
      />
    </Layout>
  );
}