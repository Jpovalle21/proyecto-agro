import { Navigate, Outlet } from "react-router-dom"
import { authStore } from "../../lib/auth"

export default function PublicRoute() {
  if (authStore.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}