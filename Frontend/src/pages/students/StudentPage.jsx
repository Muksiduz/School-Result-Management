import { students } from "../../data/students";
import StudentTable from "../../components/students/StudentTable";

function StudentsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>

          <p className="text-gray-500">Manage students</p>
        </div>

        <button
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
          ">
          Add Student
        </button>
      </div>

      <StudentTable students={students} />
    </div>
  );
}

export default StudentsPage;
