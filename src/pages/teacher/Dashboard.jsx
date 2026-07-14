import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import SubjectCard from "../../components/teacher/SubjectCard";

import {
  getCurrentTeacher,
  getTeacherSubjects,
} from "../../services/teacherDashboardService";

export default function Dashboard() {
  const [teacher, setTeacher] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true);

      const teacherResponse =
        await getCurrentTeacher();

      if (teacherResponse.error) {
        throw teacherResponse.error;
      }

      setTeacher(teacherResponse.data);

      const subjectResponse =
        await getTeacherSubjects(
          teacherResponse.data.id
        );

      if (subjectResponse.error) {
        throw subjectResponse.error;
      }

      setSubjects(subjectResponse.data ?? []);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20 text-lg">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome,
          {" "}
          {teacher?.full_name}
        </h1>

        <p className="mt-2 text-gray-600">
          Here are your assigned subjects.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h2 className="text-xl font-semibold">
            No subjects assigned.
          </h2>

          <p className="mt-2 text-gray-500">
            Please contact the administrator.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}