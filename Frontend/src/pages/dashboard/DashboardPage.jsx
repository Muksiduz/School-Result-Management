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

  const cards = [
    {
      title: "Total Students",
      value: dashboard.totalStudents,
      icon: Users,
    },
    {
      title: "Male Students",
      value: dashboard.maleStudents,
      icon: UserCheck,
    },
    {
      title: "Female Students",
      value: dashboard.femaleStudents,
      icon: UserRoundX,
    },
    {
      title: "Classes",
      value: dashboard.totalClasses,
      icon: School,
    },
    {
      title: "Exams",
      value: dashboard.totalExams,
      icon: ClipboardList,
    },
    {
      title: "Session",
      value: dashboard.currentSession?.year || "-",
      icon: Calendar,
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Home / Dashboard</p>

          <h1 className="text-5xl font-bold text-slate-900">Dashboard</h1>
        </div>
      </div>

      {/* Top Cards */}

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                bg-white
                rounded-2xl
                border
                shadow-sm
                p-5
                hover:shadow-md
                transition
              ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>

                  <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                </div>

                <Icon size={32} className="text-purple-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students Per Class */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
            p-6
          ">
          <h2 className="text-2xl font-bold mb-5">Students By Class</h2>

          <div className="space-y-4">
            {dashboard.classWiseStudents?.map((item) => (
              <div
                key={item.class_id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  pb-3
                ">
                <span className="font-medium">{item.name}</span>

                <span
                  className="
                    bg-purple-100
                    text-purple-700
                    px-3
                    py-1
                    rounded-lg
                    font-semibold
                  ">
                  {item.total_students}
                </span>
              </div>
            ))}

            {dashboard.classWiseStudents?.length === 0 && (
              <div className="text-center text-gray-500">No Classes Found</div>
            )}
          </div>
        </div>

        {/* Recent Students */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
            p-6
          ">
          <h2 className="text-2xl font-bold mb-5">Recent Students</h2>

          <div className="space-y-4">
            {dashboard.recentStudents?.map((student) => (
              <div
                key={student.student_id}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  pb-3
                ">
                <div>
                  <h3 className="font-semibold">{student.name}</h3>

                  <p className="text-sm text-gray-500">
                    Roll No: {student.roll_no}
                  </p>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-purple-100
                    flex
                    items-center
                    justify-center
                    text-purple-700
                    font-bold
                  ">
                  {student.name?.charAt(0)}
                </div>
              </div>
            ))}

            {dashboard.recentStudents?.length === 0 && (
              <div className="text-center text-gray-500">No Students Found</div>
            )}
          </div>
        </div>
      </div>

      {/* Current Session Info */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          shadow-sm
          p-6
        ">
        <h2 className="text-2xl font-bold mb-4">Current Academic Session</h2>

        {dashboard.currentSession ? (
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-semibold">{dashboard.currentSession.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Year</p>
              <p className="font-semibold">{dashboard.currentSession.year}</p>
            </div>

            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-semibold">
                {dashboard.currentSession.start_date?.split("T")[0]}
              </p>
            </div>

            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-semibold">
                {dashboard.currentSession.end_date?.split("T")[0]}
              </p>
            </div>
          </div>
        ) : (
          <p>No Active Session Found</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
