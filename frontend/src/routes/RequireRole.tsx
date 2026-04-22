import { Navigate, Outlet } from "react-router-dom";

type RequireRoleProps = {
  role: string;
};

export default function RequireRole({ role }: RequireRoleProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userRole = (user?.role || "").toString().toLowerCase();
  const requiredRole = role.toLowerCase();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

