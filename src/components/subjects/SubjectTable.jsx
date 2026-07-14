import { MdDelete, MdEdit } from "react-icons/md";

export default function SubjectTable({
  subjects,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">
              Code
            </th>

            <th className="px-4 py-3 text-left">
              Subject
            </th>

            <th className="px-4 py-3 text-left">
              Course
            </th>

            <th className="px-4 py-3 text-left">
              Section
            </th>

            <th className="px-4 py-3 text-left">
              Teacher
            </th>

            <th className="px-4 py-3 text-left">
              Units
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {subjects.length === 0 ? (

            <tr>
              <td
                colSpan="8"
                className="py-10 text-center text-gray-500"
              >
                No subjects found.
              </td>
            </tr>

          ) : (

            subjects.map((subject) => (

              <tr
                key={subject.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {subject.subject_code}
                </td>

                <td className="px-4 py-3 font-medium">
                  {subject.subject_name}
                </td>

                <td className="px-4 py-3">
                  {subject.sections?.courses?.code}
                </td>

                <td className="px-4 py-3">
                  {subject.sections
                    ? `${subject.sections.year_level}${subject.sections.section_name}`
                    : "-"}
                </td>

                <td className="px-4 py-3">
                  {subject.teachers?.full_name}
                </td>

                <td className="px-4 py-3">
                  {subject.units}
                </td>

                <td className="px-4 py-3">

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      subject.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {subject.status}
                  </span>

                </td>

                <td className="px-4 py-3">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(subject)}
                      className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                    >
                      <MdEdit size={18}/>
                    </button>

                    <button
                      onClick={() => onDelete(subject)}
                      className="rounded bg-red-100 p-2 text-red-700 hover:bg-red-200"
                    >
                      <MdDelete size={18}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}