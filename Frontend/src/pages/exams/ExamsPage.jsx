import ExamForm from "../../components/exams/ExamForm";
import ExamTable from "../../components/exams/ExamTable";

import { exams } from "../../data/exams";

function ExamsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Exams</h1>

        <p className="text-gray-500 mt-2">Manage school examinations</p>
      </div>

      <ExamForm />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Exams</h2>

        <ExamTable exams={exams} />
      </div>
    </div>
  );
}

export default ExamsPage;
