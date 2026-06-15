import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  getAllClasses,
  updateClass,
  deleteClass,
} from "../../services/classService";

function ClassTable() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [name, setName] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();

      console.log(data);

      setClasses(data.classes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this class?");

    if (!confirmDelete) return;

    try {
      await deleteClass(id);

      fetchClasses();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleEdit = (classItem) => {
    setSelectedClass(classItem);

    setName(classItem.name);

    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateClass(selectedClass.id, {
        name,
      });

      setEditModal(false);

      fetchClasses();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Update Failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading Classes...</div>;
  }

  return (
    <>
      <div
        className="
          bg-white
          border
          rounded-xl
          overflow-hidden
        ">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Classes</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Class Name</th>

              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <tr key={classItem.id} className="border-t">
                  <td className="p-4">{classItem.id}</td>

                  <td className="p-4">{classItem.name}</td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="
                          p-2
                          rounded-lg
                          bg-blue-100
                          text-blue-600
                          hover:bg-blue-200
                        ">
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(classItem.id)}
                        className="
                          p-2
                          rounded-lg
                          bg-red-100
                          text-red-600
                          hover:bg-red-200
                        ">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="
                    text-center
                    p-8
                    text-gray-500
                  ">
                  No Classes Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}

      {editModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
          ">
          <div
            className="
              bg-white
              p-6
              rounded-xl
              w-[450px]
            ">
            <h2 className="text-xl font-semibold mb-5">Update Class</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-5
              "
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="
                  px-5
                  py-2
                  border
                  rounded-xl
                ">
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="
                  px-5
                  py-2
                  bg-blue-600
                  text-white
                  rounded-xl
                ">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClassTable;
