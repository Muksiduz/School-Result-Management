import MarkRow from "./MarkRow";

function MarksTable({ marks }) {
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
            <th className="p-4 text-left">Roll No</th>

            <th className="p-4 text-left">Student</th>

            <th className="p-4 text-left">Subject</th>

            <th className="p-4 text-left">Marks</th>

            <th className="p-4 text-left">Max Marks</th>

            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {marks.map((student) => (
            <MarkRow key={student.id} student={student} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarksTable;
