import React from "react";
import { Navigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const AdminRoute = ({ children }) => {
  const { user, loadingUser } = useChat();

  if (loadingUser) return <div style={{ padding: 20 }}>Checking session…</div>;

  if (!user) return <Navigate to="/admin-login" replace />;

  if (!['Admin','SuperAdmin','admin','superadmin'].includes(String(user.role))) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
