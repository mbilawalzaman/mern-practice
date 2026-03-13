import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, logoutUser } from "../services/api";
import { clearTokens, getAccessToken } from "../utils/tokenStorage";
import DashboardLayout from "../components/DashboardLayout";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = getAccessToken();

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);
      try {
        const { data } = await fetchUsers();
        setUsers(data);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to fetch users");
        if (error.response?.status === 401) {
          clearTokens();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/login");
      return;
    }

    load();
  }, [token, navigate]);

  const handleLogout = async () => {
    await logoutUser();
    clearTokens();
    navigate("/login");
  };

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="dashboard-header">
        <h1>User directory</h1>
        <p>{users.length} active {users.length === 1 ? "profile" : "profiles"}</p>
      </div>
      {loading && <p>Loading users…</p>}
      {error && <p className="form-error">{error}</p>}
      <div className="user-grid">
        {users.map((user) => (
          <article key={user._id} className="user-card">
            <h3>{user.name}</h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
