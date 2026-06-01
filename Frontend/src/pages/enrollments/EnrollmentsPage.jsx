import EnrollmentForm from "../../components/enrollments/EnrollmentForm";
import EnrollmentTable from "../../components/enrollments/EnrollmentTable";

import { enrollments } from "../../data/enrollments";

function EnrollmentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Enrollments</h1>

        <p className="text-gray-500 mt-2">Manage student enrollments</p>
      </div>

      <EnrollmentForm />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Enrollment Records</h2>

        <EnrollmentTable enrollments={enrollments} />
      </div>
    </div>
  );
}

export default EnrollmentsPage;
