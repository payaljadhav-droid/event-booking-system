import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}