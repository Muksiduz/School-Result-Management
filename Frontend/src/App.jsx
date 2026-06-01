import DashboardLayout from "./components/layout/DashboardLayout";
import AppRouter from "./app/router/AppRouter";

function App() {
  return (
    <DashboardLayout>
      <AppRouter />
    </DashboardLayout>
  );
}

export default App;
