export default function DashboardCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}