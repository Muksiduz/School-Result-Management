function ExamTable({ exams }) {
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
            <th className="p-4 text-left">Exam Name</th>

            <th className="p-4 text-left">Session</th>

            <th className="p-4 text-left">Type</th>

            <th className="p-4 text-left">Start Date</th>

            <th className="p-4 text-left">End Date</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className="border-t">
              <td className="p-4">{exam.examName}</td>

              <td className="p-4">{exam.session}</td>

              <td className="p-4">{exam.examType}</td>

              <td className="p-4">{exam.startDate}</td>

              <td className="p-4">{exam.endDate}</td>

              <td className="p-4">
                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ${
                      exam.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}>
                  {exam.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExamTable;
