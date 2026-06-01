function ResultStats() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="bg-white border rounded-xl p-5">
        <p className="text-gray-500">Pass Percentage</p>

        <h2 className="text-3xl font-bold mt-2">95%</h2>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <p className="text-gray-500">Fail Percentage</p>

        <h2 className="text-3xl font-bold mt-2">5%</h2>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <p className="text-gray-500">Class Average</p>

        <h2 className="text-3xl font-bold mt-2">72%</h2>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <p className="text-gray-500">Topper</p>

        <h2 className="text-xl font-bold mt-2">Rahim Ali</h2>
      </div>
    </div>
  );
}

export default ResultStats;
