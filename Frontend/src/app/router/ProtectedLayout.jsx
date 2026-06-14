import DashboardLayout from "../../components/layout/DashboardLayout";

function ProtectedLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
export default ProtectedLayout;
