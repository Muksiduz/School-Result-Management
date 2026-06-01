function SessionTable({ sessions }) {
  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        overflow-hidden
      ">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Session</th>

            <th className="p-4 text-left">Start Date</th>

            <th className="p-4 text-left">End Date</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-t">
              <td className="p-4">{session.sessionName}</td>

              <td className="p-4">{session.startDate}</td>

              <td className="p-4">{session.endDate}</td>

              <td className="p-4">
                {session.active ? (
                  <span
                    className="
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                      text-sm
                    ">
                    Active
                  </span>
                ) : (
                  <span
                    className="
                      bg-gray-100
                      text-gray-600
                      px-3
                      py-1
                      rounded-full
                      text-sm
                    ">
                    Inactive
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionTable;
