import { Navigate } from "react-router-dom";
import useUserRole from "../context/useUserRole";

export default function AdminRoute({ children }) {
  const { role, loading } = useUserRole();

  if (loading) return null;

  if (role !== "owner") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
