import { useEffect, useState } from "react";

import {
  Users,
  School,
  BookOpen,
  ClipboardList,
  Calendar,
  Layers,
} from "lucide-react";

import api from "../../utils/axios";

function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    students: 0,
    classes: 0,
    subjects: 0,
    sections: 0,
    sessions: 0,
    exams: 0,
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
      title: "Students",
      value: dashboard.students,
      icon: Users,
    },
    {
      title: "Classes",
      value: dashboard.classes,
      icon: School,
    },
    {
      title: "Subjects",
      value: dashboard.subjects,
      icon: BookOpen,
    },
    {
      title: "Exams",
      value: dashboard.exams,
      icon: ClipboardList,
    },
    {
      title: "Sessions",
      value: dashboard.sessions,
      icon: Calendar,
    },
    {
      title: "Sections",
      value: dashboard.sections,
      icon: Layers,
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
      <h1 className="text-4xl font-bold">Dashboard</h1>

      {/* Stats Cards */}

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                bg-white
                rounded-xl
                shadow
                p-5
                border
              ">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>

                  <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                </div>

                <Icon size={32} className="text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Students */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            border
            p-5
          ">
          <h2 className="text-xl font-semibold mb-4">Recent Students</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Roll No</th>

                <th className="text-left p-2">Name</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentStudents?.map((student) => (
                <tr key={student.student_id} className="border-b">
                  <td className="p-2">{student.roll_no}</td>

                  <td className="p-2">{student.name}</td>
                </tr>
              ))}

              {dashboard.recentStudents?.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="
                      p-4
                      text-center
                      text-gray-500
                    ">
                    No Students Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            border
            p-5
          ">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="
                bg-blue-600
                text-white
                p-4
                rounded-xl
                hover:bg-blue-700
              ">
              Add Student
            </button>

            <button
              className="
                bg-green-600
                text-white
                p-4
                rounded-xl
                hover:bg-green-700
              ">
              Create Exam
            </button>

            <button
              className="
                bg-purple-600
                text-white
                p-4
                rounded-xl
                hover:bg-purple-700
              ">
              Add Subject
            </button>

            <button
              className="
                bg-orange-600
                text-white
                p-4
                rounded-xl
                hover:bg-orange-700
              ">
              Enter Marks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
