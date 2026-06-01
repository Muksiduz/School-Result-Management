function ClassTable({ classes }) {
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
            <th className="p-4 text-left">Class</th>

            <th className="p-4 text-left">Sections</th>

            <th className="p-4 text-left">Students</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">{item.className}</td>

              <td className="p-4">{item.sectionCount}</td>

              <td className="p-4">{item.studentCount}</td>

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
                  Active
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassTable;
