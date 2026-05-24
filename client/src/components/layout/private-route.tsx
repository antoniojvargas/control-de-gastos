import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { ReactNode } from "react";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
