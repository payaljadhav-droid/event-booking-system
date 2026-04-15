import { Navigate, Outlet } from "react-router-dom";

export default function RedirectIfAuth() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}