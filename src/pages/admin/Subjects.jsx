import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";
import SubjectModal from "../../components/subjects/SubjectModal";
import SubjectTable from "../../components/subjects/SubjectTable";

import {
  deleteSubject,
  getSubjects,
} from "../../services/subjectService";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    setErrorMessage("");

    const { data, error } = await getSubjects();

    if (error) {
      console.error(error);
      setErrorMessage("Unable to load subjects.");
      return;
    }

    setSubjects(data ?? []);
  }

  function handleAddSubject() {
    setSelectedSubject(null);
    setOpenModal(true);
  }

  function handleEditSubject(subject) {
    setSelectedSubject(subject);
    setOpenModal(true);
  }

  async function handleDeleteSubject(subject) {
    const confirmed = window.confirm(
      `Delete ${subject.subject_code} — ${subject.subject_name}?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await deleteSubject(subject.id);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }

    await fetchSubjects();
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSelectedSubject(null);
    fetchSubjects();
  }

  const filteredSubjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return subjects;
    }

    return subjects.filter((subject) => {
      const courseCode =
        subject.sections?.courses?.code ?? "";

      const sectionName = subject.sections
        ? `${subject.sections.year_level}${subject.sections.section_name}`
        : "";

      const teacherName =
        subject.teachers?.full_name ?? "";

      return (
        subject.subject_code
          ?.toLowerCase()
          .includes(keyword) ||
        subject.subject_name
          ?.toLowerCase()
          .includes(keyword) ||
        courseCode.toLowerCase().includes(keyword) ||
        sectionName.toLowerCase().includes(keyword) ||
        teacherName.toLowerCase().includes(keyword)
      );
    });
  }, [subjects, search]);

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Subjects
          </h1>

          <p className="text-gray-500">
            Manage all school subjects.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddSubject}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Subject
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
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search subject..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <SubjectTable
        subjects={filteredSubjects}
        onEdit={handleEditSubject}
        onDelete={handleDeleteSubject}
      />

      <SubjectModal
        isOpen={openModal}
        subject={selectedSubject}
        onClose={handleCloseModal}
      />
    </Layout>
  );
}