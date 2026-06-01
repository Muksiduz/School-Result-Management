function SessionForm() {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-6">Create Session</h2>

      <div className="grid grid-cols-2 gap-5">
        <input
          type="text"
          placeholder="Session Name"
          className="
            border
            p-3
            rounded-xl
          "
        />

        <input
          type="date"
          className="
            border
            p-3
            rounded-xl
          "
        />

        <input
          type="date"
          className="
            border
            p-3
            rounded-xl
          "
        />
      </div>

      <button
        className="
          mt-5
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
        ">
        Save Session
      </button>
    </div>
  );
}

export default SessionForm;
