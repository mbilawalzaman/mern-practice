import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, onLogout }) => (
  <div className="dashboard-shell">
    <Sidebar onLogout={onLogout} />

    <main className="dashboard-main">{children}</main>
  </div>
);

export default DashboardLayout;
