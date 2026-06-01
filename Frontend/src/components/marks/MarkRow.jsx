function MarkRow({ student }) {
  return (
    <tr className="border-t">
      <td className="p-4">{student.rollNo}</td>

      <td className="p-4">{student.studentName}</td>

      <td className="p-4">{student.subject}</td>

      <td className="p-4">
        <input
          type="number"
          defaultValue={student.marks}
          className="
            w-24
            border
            rounded-lg
            p-2
          "
        />
      </td>

      <td className="p-4">{student.maxMarks}</td>

      <td className="p-4">
        <select
          defaultValue={student.status}
          className="
            border
            rounded-lg
            p-2
          ">
          <option>Present</option>
          <option>Absent</option>
        </select>
      </td>
    </tr>
  );
}

export default MarkRow;
