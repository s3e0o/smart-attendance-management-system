import { MdDelete, MdEdit } from "react-icons/md";

export default function TeacherTable({
  teachers,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">
              Employee No.
            </th>

            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Email
            </th>

            <th className="px-4 py-3 text-left">
              Department
            </th>

            <th className="px-4 py-3 text-left">
              Course
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
          {teachers.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="py-12 text-center text-gray-500"
              >
                No teachers found.
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {teacher.employee_number}
                </td>

                <td className="px-4 py-3 font-medium">
                  {teacher.full_name}
                </td>

                <td className="px-4 py-3">
                  {teacher.email}
                </td>

                <td className="px-4 py-3">
                  {teacher.department}
                </td>

                <td className="px-4 py-3">
                  {teacher.courses?.code ?? "-"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      teacher.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(teacher)}
                      className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                      aria-label={`Edit ${teacher.full_name}`}
                    >
                      <MdEdit size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(teacher)}
                      className="rounded bg-red-100 p-2 text-red-700 hover:bg-red-200"
                      aria-label={`Delete ${teacher.full_name}`}
                    >
                      <MdDelete size={18} />
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