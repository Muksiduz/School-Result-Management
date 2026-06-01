function DashboardPage() {
  const stats = [
    {
      title: "Total Students",
      value: "1,580",
    },
    {
      title: "Active Students",
      value: "1,420",
    },
    {
      title: "Classes",
      value: "12",
    },
    {
      title: "Exams",
      value: "8",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-5">
        {stats.map((item) => (
          <div
            key={item.title}
            className="
              bg-white
              rounded-2xl
              p-6
              shadow-sm
              border
            ">
            <p className="text-gray-500">{item.title}</p>

            <h2 className="text-4xl font-bold mt-3">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
