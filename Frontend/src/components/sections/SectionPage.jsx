import { useEffect, useState } from "react";
import {
  getAllSections,
  createSection,
  deleteSection,
  updateSection,
} from "../../services/sectionService";

import { getAllClasses } from "../../services/classService";

import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

function SectionPage() {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    class_id: "",
  });

  const fetchSections = async () => {
    try {
      const data = await getAllSections();

      // depending on backend response
      setSections(data.sections || data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();

      setClasses(data.classes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.class_id) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      await createSection(formData);

      setFormData({
        name: "",
        class_id: "",
      });

      fetchSections();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to create section");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingId(section.section_id);
    setEditName(section.name);
  };

  const handleUpdate = async () => {
    try {
      await updateSection(editingId, {
        name: editName,
      });

      setEditingId(null);
      setEditName("");

      fetchSections();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this section?");

    if (!confirmDelete) return;

    try {
      await deleteSection(id);

      fetchSections();
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to delete section");
    }
  };
  const filteredSections = sections.filter((section) => {
    const search = searchTerm.toLowerCase();

    return (
      section.name?.toLowerCase().includes(search) ||
      section.class_name?.toLowerCase().includes(search) ||
      section.section_id?.toString().includes(search)
    );
  });

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Section Management</h1>
        </div>

        {/* Create Form */}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Section Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <select
            value={formData.class_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                class_id: e.target.value,
              })
            }
            className="border p-3 rounded-lg">
            <option value="">Select Class</option>

            {classes.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg">
            <Plus size={18} />

            {loading ? "Creating..." : "Add Section"}
          </button>
        </form>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Section Name, Class Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-lg w-full max-w-md"
          />

          <div className="ml-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
            Total: {filteredSections.length}
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">ID</th>

                <th className="border p-3">Section Name</th>

                <th className="border p-3">Class</th>

                <th className="border p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSections.map((section) => (
                <tr key={section.section_id}>
                  <td className="border p-3">{section.section_id}</td>

                  <td className="border p-3">
                    {editingId === section.section_id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-2 rounded w-full"
                      />
                    ) : (
                      section.name
                    )}
                  </td>

                  <td className="border p-3">{section.class_name}</td>

                  <td className="border p-3">
                    <div className="flex gap-2">
                      {editingId === section.section_id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="p-2 bg-green-600 text-white rounded">
                            <Save size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                            }}
                            className="p-2 bg-gray-500 text-white rounded">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(section)}
                            className="p-2 bg-blue-600 text-white rounded">
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(section.section_id)}
                            className="p-2 bg-red-600 text-white rounded">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {sections.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-5">
                    No Sections Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SectionPage;
