import { useEffect, useState } from "react";
import { useOldStudentsStore } from "../store/oldStuduntsStore.js";

export function OldStudentsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [createStudents, setCreateStudents] = useState({
    name: null,
    roll_no: null,
    old_session_id: null,
  });
  const {
    oldStudents,
    loading,
    error,
    oldSession,
    selectedSession,
    setSelectedSession,
    initialFetch,
    createOldStudents,
  } = useOldStudentsStore();
  useEffect(() => {
    initialFetch();
  }, []);

  //   console.log("old Std",oldStudents);
  console.log("old Ses", oldSession);
  console.log("error", error);

  async function handleCreate() {
    
    try {
      await createOldStudents(createStudents);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <h1>Old Students</h1>
      <button onClick={() => setAddOpen((prev) => !prev)}>ADD</button>
      <div>
        <select
          value={selectedSession?.old_session_id || ""}
          onChange={(e) => {
            const s = oldSession.find(
              (s) => s.old_session_id == e.target.value,
            );
            setSelectedSession(s);
            console.log("ss", s);
          }}
        >
          <option value={""}>Select session</option>
          {oldSession?.map((o) => (
            <option key={o.old_session_id} value={o.old_session_id}>
              {o.name}
            </option>
          ))}
        </select>
        <div>
          {oldStudents?.map((e) => (
            <div key={e.old_student_id}>
              <p>{e.name}</p>
              <p>{e.roll_no}</p>
            </div>
          ))}
        </div>
      </div>
      {addOpen && (
        <div>
          <input
            placeholder="name"
            onChange={(e) => {
              setCreateStudents((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <input
            placeholder="Roll Number"
            onChange={(e) => {
              setCreateStudents((prev) => ({
                ...prev,
                roll_no: e.target.value,
              }));
            }}
          />
          <select
            onChange={(e) => {
              setCreateStudents((prev) => ({
                ...prev,
                old_session_id: e.target.value,
              }));
            }}
          >
            <option value={""}>Select Session</option>
            {oldSession.map((s) => (
              <option key={s.old_session_id} value={s.old_session_id}>
                {s.name}
              </option>
            ))}
          </select>
          <button onClick={handleCreate}>Submit</button>
        </div>
      )}
    </main>
  );
}
