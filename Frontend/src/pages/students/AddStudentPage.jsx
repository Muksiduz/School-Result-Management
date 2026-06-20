import { useEffect, useState } from "react";
import { createStudent } from "../../services/studentService";
import { getAllClasses } from "../../services/classService";
import { getSectionsByClass } from "../../services/sectionService";
import { X, UserPlus } from "lucide-react";

function AddStudent({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    class_id: "",
    section_id: "",
    gender: "",
    father_name: "",
    mother_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
    created_by: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data.classes);
    } catch (error) {
      alert(error.response?.data?.message || "Failed To Fetch Classes");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "class_id") {
      try {
        setFormData((prev) => ({ ...prev, class_id: value, section_id: "" }));
        const data = await getSectionsByClass(value);
        setSections(data);
      } catch (error) {
        console.log(error);
      }
    }
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
      onClose?.();
    } catch (error) {
      alert(error.response?.data?.message || "Failed To Create Student");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <>
      {/* Modal Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Add New Student
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Fill in the details to register a student
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="overflow-y-auto flex-1 px-6 py-5">
        <form id="addStudentForm" onSubmit={handleSubmit}>
          {/* Section: Basic Info */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Basic Information
            </span>
            <div className="flex-1 h-px bg-purple-100" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Student Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Roll Number</label>
              <input
                type="text"
                name="roll_no"
                placeholder="e.g. 01"
                value={formData.roll_no}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Class *</label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                className={inputClass}
                required>
                <option value="">Select class</option>
                {classes?.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Section *</label>
              <select
                name="section_id"
                value={formData.section_id}
                onChange={handleChange}
                className={inputClass}
                disabled={!formData.class_id}
                required>
                <option value="">Select section</option>
                {sections?.map((sec) => (
                  <option key={sec.section_id} value={sec.section_id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            {/* gender  */}
            <div>
              <label className={labelClass}>Gender *</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
                required>
                <option value="">Select Gender</option>

                <option value="Male">Male</option>

                <option value="Female">Female</option>

                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Section: Guardian */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Guardian Details
            </span>
            <div className="flex-1 h-px bg-purple-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Father's Name</label>
              <input
                type="text"
                name="father_name"
                placeholder="Father's full name"
                value={formData.father_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mother's Name</label>
              <input
                type="text"
                name="mother_name"
                placeholder="Mother's full name"
                value={formData.mother_name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Address</label>
              <textarea
                name="address"
                placeholder="Full residential address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputClass} min-h-20 resize-none`}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          form="addStudentForm"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
          <UserPlus size={15} />
          {loading ? "Creating..." : "Create Student"}
        </button>
      </div>
    </>
  );
}

export default AddStudent;
