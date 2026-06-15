import { useEffect, useState } from "react";

import { createStudent } from "../../services/studentService";
import { getAllClasses } from "../../services/classService";

function AddStudent() {
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    class_id: "",
    section_id: "",
    father_name: "",
    mother_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();

      console.log("FULL RESPONSE:", data);

      setClasses(data.classes);
    } catch (error) {
      alert(error.response?.data?.message || "Failed To Fetch Classes");
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createStudent({
        ...formData,
        class_id: Number(formData.class_id),
        section_id: Number(formData.section_id),
      });

      alert("Student Created Successfully");

      setFormData({
        name: "",
        roll_no: "",
        class_id: "",
        section_id: "",
        father_name: "",
        mother_name: "",
        phone: "",
        date_of_birth: "",
        address: "",
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed To Create Student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white border rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-8">Add Student</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="roll_no"
            placeholder="Roll Number"
            value={formData.roll_no}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          {/* Class Dropdown */}

          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="border p-3 rounded-xl">
            <option value="">Select Class</option>
            {console.log(classes)}

            {classes?.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>

          {/* Section ID */}

          {/* <input
            type="number"
            name="section_id"
            placeholder="Section ID"
            value={formData.section_id}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            name="father_name"
            placeholder="Father Name"
            value={formData.father_name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          /> */}

          <input
            type="text"
            name="father_name"
            placeholder="Father Name"
            value={formData.father_name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />
          <input
            type="text"
            name="mother_name"
            placeholder="Mother Name"
            value={formData.mother_name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="border p-3 rounded-xl"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="
              col-span-2
              border
              p-3
              rounded-xl
              min-h-[120px]
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              col-span-2
              bg-blue-600
              text-white
              py-3
              rounded-xl
              hover:bg-blue-700
              disabled:opacity-50
            ">
            {loading ? "Creating..." : "Create Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
