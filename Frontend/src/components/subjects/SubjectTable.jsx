function SubjectTable({ subjects }) {
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
            <th className="p-4 text-left">Subject Name</th>

            <th className="p-4 text-left">Subject Code</th>

            <th className="p-4 text-left">Assigned Class</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className="border-t">
              <td className="p-4">{subject.subjectName}</td>

              <td className="p-4">{subject.subjectCode}</td>

              <td className="p-4">{subject.assignedClass}</td>

              <td className="p-4">
                <span
                  className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  ">
                  {subject.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubjectTable;
