import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../services/userService";

import { Pencil, Trash2 } from "lucide-react";

function GetUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModal, setEditModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    username: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      setUsers(response.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {
      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);

    setEditData({
      name: user.name,
      username: user.username,
      role: user.role,
    });

    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateUser(selectedUser.id, editData);

      setEditModal(false);

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  if (loading) {
    return <div className="p-8">Loading Users...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Users</h1>

      <div
        className="
          bg-white
          rounded-3xl
          border
          overflow-hidden
        ">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Username</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.id}</td>

                <td className="p-4">{user.name}</td>

                <td className="p-4">{user.username}</td>

                <td className="p-4 capitalize">{user.role}</td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="
        p-2
        rounded-lg
        bg-blue-100
        text-blue-600
        hover:bg-blue-200
        transition
      "
                      title="Edit User">
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="
        p-2
        rounded-lg
        bg-red-100
        text-red-600
        hover:bg-red-200
        transition
      "
                      title="Delete User">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}

      {editModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
          ">
          <div
            className="
              bg-white
              p-8
              rounded-2xl
              w-[500px]
            ">
            <h2 className="text-2xl font-bold mb-6">Update User</h2>

            <input
              type="text"
              placeholder="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <input
              type="text"
              placeholder="Username"
              value={editData.username}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  username: e.target.value,
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-4
              "
            />

            <select
              value={editData.role}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  role: e.target.value,
                })
              }
              className="
                w-full
                border
                p-3
                rounded-xl
                mb-6
              ">
              <option value="admin">Admin</option>

              <option value="teacher">Teacher</option>

              <option value="viewer">Viewer</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="
                  px-5
                  py-3
                  rounded-xl
                  border
                ">
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="
                  bg-blue-600
                  text-white
                  px-5
                  py-3
                  rounded-xl
                ">
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetUsers;
