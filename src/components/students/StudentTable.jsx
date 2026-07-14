import { MdEdit, MdDelete } from "react-icons/md";

export default function StudentTable({
    students,
    onEdit,
    onDelete,
}) {

    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow">

            <table className="min-w-full">

                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Student No.</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Course</th>
                        <th className="px-4 py-3 text-left">Section</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {students.length === 0 ? (

                        <tr>
                            <td
                                colSpan="7"
                                className="py-10 text-center text-gray-500"
                            >
                                No students found.
                            </td>
                        </tr>

                    ) : (

                        students.map((student) => (

                            <tr
                                key={student.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3">
                                    {student.student_number}
                                </td>

                                <td className="px-4 py-3 font-medium">
                                    {student.full_name}
                                </td>

                                <td className="px-4 py-3">
                                    {student.email}
                                </td>

                                <td className="px-4 py-3">
                                    {student.courses?.code}
                                </td>

                                <td className="px-4 py-3">
                                    {student.sections
                                        ? `${student.sections.year_level}${student.sections.section_name}`
                                        : "-"}
                                </td>

                                <td className="px-4 py-3">

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${student.status === "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {student.status}
                                    </span>

                                </td>

                                <td className="px-4 py-3">

                                    <div className="flex justify-center gap-2">

                                        <button
                                            onClick={() => onEdit(student)}
                                            className="rounded bg-yellow-100 p-2 text-yellow-700 hover:bg-yellow-200"
                                        >
                                            <MdEdit size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(student)}
                                            className="rounded bg-red-100 p-2 text-red-700 hover:bg-red-200"
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