function ResultTable({ results }) {
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
            <th className="p-4 text-left">Rank</th>

            <th className="p-4 text-left">Student</th>

            <th className="p-4 text-left">Total Marks</th>

            <th className="p-4 text-left">Percentage</th>

            <th className="p-4 text-left">Division</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-t">
              <td className="p-4">#{result.rank}</td>

              <td className="p-4">{result.studentName}</td>

              <td className="p-4">{result.totalMarks}</td>

              <td className="p-4">{result.percentage}%</td>

              <td className="p-4">{result.division}</td>

              <td className="p-4">
                <span
                  className={
                    result.status === "PASS"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                  }>
                  {result.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultTable;
