function EnrollmentTable({ enrollments }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Admission No</th>

            <th className="p-4 text-left">Student</th>

            <th className="p-4 text-left">Session</th>

            <th className="p-4 text-left">Class</th>

            <th className="p-4 text-left">Section</th>

            <th className="p-4 text-left">Roll No</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">{item.admissionNo}</td>

              <td className="p-4">{item.studentName}</td>

              <td className="p-4">{item.session}</td>

              <td className="p-4">{item.className}</td>

              <td className="p-4">{item.section}</td>

              <td className="p-4">{item.rollNo}</td>

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
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EnrollmentTable;
