import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserRoundX,
  School,
  ClipboardList,
  Calendar,
} from "lucide-react";
import api from "../../utils/axios";

function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    totalClasses: 0,
    totalExams: 0,
    currentSession: null,
    classWiseStudents: [],
    recentStudents: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const malePercent =
    dashboard.totalStudents > 0
      ? Math.round((dashboard.maleStudents / dashboard.totalStudents) * 100)
      : 0;
  const femalePercent = 100 - malePercent;

  // Donut chart values
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const maleDash = (malePercent / 100) * circumference;
  const femaleDash = (femalePercent / 100) * circumference;

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen space-y-5">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400 mb-1">Home / Dashboard</p>
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: "Total Students",
            value: dashboard.totalStudents,
            icon: Users,
            bg: "bg-purple-50",
            iconColor: "text-purple-500",
          },
          {
            title: "Male Students",
            value: dashboard.maleStudents,
            icon: UserCheck,
            bg: "bg-blue-50",
            iconColor: "text-blue-500",
          },
          {
            title: "Female Students",
            value: dashboard.femaleStudents,
            icon: UserRoundX,
            bg: "bg-pink-50",
            iconColor: "text-pink-500",
          },
          {
            title: "Classes",
            value: dashboard.totalClasses,
            icon: School,
            bg: "bg-amber-50",
            iconColor: "text-amber-500",
          },
          {
            title: "Exams",
            value: dashboard.totalExams,
            icon: ClipboardList,
            bg: "bg-green-50",
            iconColor: "text-green-500",
          },
          {
            title: "Session",
            value: dashboard.currentSession?.year || "—",
            icon: Calendar,
            bg: "bg-indigo-50",
            iconColor: "text-indigo-500",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white/70 rounded-2xl border border-purple-100 p-5 hover:shadow-sm transition-shadow">
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={20} className={card.iconColor} />
              </div>
              <p className="text-xs text-gray-400 font-medium">{card.title}</p>
              <h2 className="text-2xl font-bold text-gray-800 mt-0.5">
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Students By Class */}
        <div className="lg:col-span-2 bg-white/70 rounded-2xl border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Students By Class
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Enrollment per class
              </p>
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              {dashboard.classWiseStudents?.length} Classes
            </span>
          </div>

          {dashboard.classWiseStudents?.length > 0 ? (
            <div className="space-y-3">
              {dashboard.classWiseStudents.map((item) => {
                const max = Math.max(
                  ...dashboard.classWiseStudents.map((c) =>
                    Number(c.total_students),
                  ),
                );
                const pct =
                  max > 0
                    ? Math.round((Number(item.total_students) / max) * 100)
                    : 0;
                return (
                  <div key={item.class_id} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-20 flex-shrink-0">
                      {item.name}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-lg w-8 text-center flex-shrink-0">
                      {item.total_students}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-sm text-gray-400">
              No classes found
            </div>
          )}
        </div>

        {/* Gender Donut */}
        <div className="bg-white/70 rounded-2xl border border-purple-100 p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-800">Students</h2>
            <p className="text-xs text-gray-400 mt-0.5">Gender distribution</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {/* SVG Donut */}
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="16"
                />
                {/* Female arc (orange) — drawn first, full */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="16"
                  strokeDasharray={`${femaleDash} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
                {/* Male arc (purple) */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="16"
                  strokeDasharray={`${maleDash} ${circumference}`}
                  strokeDashoffset={-femaleDash}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
                {/* Center text */}
                <text
                  x="70"
                  y="63"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9ca3af"
                  fontFamily="sans-serif">
                  Total
                </text>
                <text
                  x="70"
                  y="82"
                  textAnchor="middle"
                  fontSize="18"
                  fill="#1f2937"
                  fontWeight="bold"
                  fontFamily="sans-serif">
                  {dashboard.totalStudents}
                </text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600" />
                <div>
                  <p className="text-xs text-gray-400">Male</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {dashboard.maleStudents}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      ({malePercent}%)
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <div>
                  <p className="text-xs text-gray-400">Female</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {dashboard.femaleStudents}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      ({femalePercent}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white/70 rounded-2xl border border-purple-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Recent Students
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Latest enrollments</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Class
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentStudents?.length > 0 ? (
                dashboard.recentStudents.map((student) => (
                  <tr
                    key={student.student_id}
                    className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <span className="font-medium text-gray-700">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        #{student.roll_no}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                        {student.class_name || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-10 text-sm text-gray-400">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Current Session */}
        <div className="bg-white/70 rounded-2xl border border-purple-100 p-6 flex flex-col">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Current Session
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Active academic year</p>
          </div>

          {dashboard.currentSession ? (
            <div className="flex-1 flex flex-col gap-4">
              {/* Session name banner */}
              <div className="bg-purple-600 rounded-xl px-4 py-3 text-center">
                <p className="text-purple-200 text-xs font-medium mb-0.5">
                  Session Name
                </p>
                <p className="text-white text-lg font-bold">
                  {dashboard.currentSession.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Year</p>
                  <p className="text-sm font-semibold text-purple-700">
                    {dashboard.currentSession.year}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center col-span-1">
                  <p className="text-xs text-gray-400 mb-1">Start Date</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {dashboard.currentSession.start_date?.split("T")[0] || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center col-span-1">
                  <p className="text-xs text-gray-400 mb-1">End Date</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {dashboard.currentSession.end_date?.split("T")[0] || "—"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Calendar size={32} className="mx-auto mb-2 text-gray-200" />
                <p className="text-sm text-gray-400">No active session found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
