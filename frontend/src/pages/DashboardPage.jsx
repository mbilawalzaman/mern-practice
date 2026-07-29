import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, logoutUser } from "../services/api";
import { clearTokens, getAccessToken } from "../utils/tokenStorage";
import DashboardLayout from "../components/DashboardLayout";


const DashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = getAccessToken();

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);
      try {
        const { data } = await fetchUsers();
        setTotalUsers(data.length);
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
        <h1>Dashboard</h1>
        <p>Snapshot of the active roster</p>
      </div>
      {loading && <p>Loading users…</p>}
      {error && <p className="form-error">{error}</p>}
      <div className="summary-grid">
        <article className="summary-card">
          <p className="eyebrow">Total members</p>
          <h2>{totalUsers}</h2>
          <p>Users currently registered</p>
        </article>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
