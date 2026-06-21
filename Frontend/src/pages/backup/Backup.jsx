import { useState } from "react";
import api from "../api/api.js";

export default function Backup() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBackup = async () => {
    if (!password) return setError("Please enter the database password");
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.post(
        "/backup",
        { db_password: password },
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "school_backup.dump");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess(true);
      setPassword("");
    } catch (err) {
      setError("Backup failed. Check your password and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Database Backup</h1>
      <p className="text-gray-500 mb-6">
        Enter the PostgreSQL password to download a full backup.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 mb-4">Backup downloaded successfully.</p>
      )}

      <input
        type="password"
        placeholder="Enter database password"
        className="border p-2 rounded w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleBackup}
        disabled={loading || !password}
        className="bg-blue-500 text-white px-6 py-2 rounded disabled:opacity-50 w-full"
      >
        {loading ? "Creating backup..." : "Download Backup"}
      </button>
    </div>
  );
}
