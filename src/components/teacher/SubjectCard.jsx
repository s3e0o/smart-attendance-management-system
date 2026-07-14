import { Link } from "react-router-dom";

export default function SubjectCard({ subject }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        {subject.subject_name}
      </h2>

      <p className="mt-1 text-gray-600">
        {subject.subject_code}
      </p>

      <div className="mt-4 space-y-1 text-gray-700">
        <p>
          Course:{" "}
          <strong>
            {subject.sections?.courses?.code}
          </strong>
        </p>

        <p>
          Section:{" "}
          <strong>
            Year {subject.sections?.year_level} -{" "}
            {subject.sections?.section_name}
          </strong>
        </p>
      </div>

      <Link
        to={`/teacher/attendance/${subject.id}`}
        className="mt-6 block rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-700"
      >
        Start Attendance
      </Link>
    </div>
  );
}