import ClassForm from "../../components/classes/ClassForm";
import ClassTable from "../../components/classes/ClassTable";

import { classes } from "../../data/classes";

function ClassesPage() {
  return (
    <div>
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Classes</h1>

        <p className="text-gray-500 mt-2">Manage school classes</p>
      </div>

      {/* Create Class */}

      <ClassForm />

      {/* Existing Classes */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Classes</h2>

        <ClassTable classes={classes} />
      </div>
    </div>
  );
}

export default ClassesPage;
