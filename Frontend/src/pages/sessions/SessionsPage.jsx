import SessionForm from "../../components/sessions/SessionForm";
import SessionTable from "../../components/sessions/SessionTable";

import { sessions } from "../../data/sessions";

function SessionsPage() {
  return (
    <div>
      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sessions</h1>

        <p className="text-gray-500 mt-2">Manage academic sessions</p>
      </div>

      {/* Form */}

      <SessionForm />

      {/* Table */}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Sessions</h2>

        <SessionTable sessions={sessions} />
      </div>
    </div>
  );
}

export default SessionsPage;
