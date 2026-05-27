import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.accessToken);
  if (!token) return <Navigate to="/dang-nhap" replace />;
  return children;
}