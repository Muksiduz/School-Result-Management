import SubjectForm from "../../components/subjects/SubjectForm";
import SubjectTable from "../../components/subjects/SubjectTable";

import { subjects } from "../../data/subject";

function SubjectsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subjects</h1>

        <p className="text-gray-500 mt-2">Manage school subjects</p>
      </div>

      <SubjectForm />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Subjects</h2>

        <SubjectTable subjects={subjects} />
      </div>
    </div>
  );
}

export default SubjectsPage;
