import { useEffect, useState } from "react";
import {
  getAllSections,
  createSection,
  deleteSection,
  updateSection,
} from "../../services/sectionService";
import { getAllClasses } from "../../services/classService";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Search,
  ClipboardList,
} from "lucide-react";

function SectionPage() {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", class_id: "" });

  const fetchSections = async () => {
    try {
      const data = await getAllSections();
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
    if (!formData.name || !formData.class_id)
      return alert("All fields are required");
    try {
      setLoading(true);
      await createSection(formData);
      setFormData({ name: "", class_id: "" });
      fetchSections();
      setShowForm(false);
    } catch (error) {
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
      await updateSection(editingId, { name: editName });
      setEditingId(null);
      setEditName("");
      fetchSections();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this section?")) return;
    try {
      await deleteSection(id);
      fetchSections();
    } catch (error) {
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

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1.5";

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Home / Section</p>
          <h1 className="text-2xl font-semibold text-gray-800">
            Section Management
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white/70 rounded-2xl border border-purple-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">
            All Sections
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 w-52"
              />
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              Total: {filteredSections.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Section Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map((section) => (
                <tr
                  key={section.section_id}
                  className="border-b border-gray-50 hover:bg-purple-50/40 transition-colors">
                  <td className="px-6 py-3">
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                      #{section.section_id}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <ClipboardList size={14} />
                      </div>
                      {editingId === section.section_id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                      ) : (
                        <span className="font-medium text-gray-700">
                          {section.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
                      {section.class_name}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {editingId === section.section_id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 transition-colors">
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 transition-colors">
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(section)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(section.section_id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sections.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-400">
                    <ClipboardList
                      size={36}
                      className="mx-auto mb-2 opacity-30"
                    />
                    No sections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Section Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-start justify-between px-6 pt-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Add New Section
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Create a new section record
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form
              id="sectionForm"
              onSubmit={handleSubmit}
              className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Section Details
                </span>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div>
                <label className={labelClass}>Section Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Section A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Class *</label>
                <select
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData({ ...formData, class_id: e.target.value })
                  }
                  className={inputClass}
                  required>
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                form="sectionForm"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors">
                <Plus size={15} />
                {loading ? "Creating..." : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionPage;
