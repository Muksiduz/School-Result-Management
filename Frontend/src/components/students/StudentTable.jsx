function StudentTable({ students }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Admission No</th>

            <th className="p-4 text-left">Name</th>

            <th className="p-4 text-left">Class</th>

            <th className="p-4 text-left">Gender</th>

            <th className="p-4 text-left">Phone</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t">
              <td className="p-4">{student.admissionNo}</td>

              <td className="p-4">
                {student.firstName} {student.lastName}
              </td>

              <td className="p-4">{student.className}</td>

              <td className="p-4">{student.gender}</td>

              <td className="p-4">{student.phone}</td>

              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
