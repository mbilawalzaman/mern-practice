import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/tokenStorage";
import useActivityHeartbeat from "../hooks/useActivityHeartbeat";

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  useActivityHeartbeat(!!token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
