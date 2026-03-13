import { NavLink } from "react-router-dom";

const Sidebar = ({ onLogout }) => (
  <aside className="dashboard-sidebar">
    <div>
      <p className="eyebrow">Active Users</p>
      <h2>Team roster</h2>
      <nav className="sidebar-nav">
        <NavLink
          end
          to="/dashboard"
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
        >
          🏠 Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
        >
          👥 Users
        </NavLink>
      </nav>
    </div>
    <button className="ghost" onClick={onLogout}>
      Logout
    </button>
  </aside>
);

export default Sidebar;
