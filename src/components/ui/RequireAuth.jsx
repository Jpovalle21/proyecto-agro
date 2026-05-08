import { useState, useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { authStore } from "../../lib/auth"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api"

export default function RequireAuth() {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Si ya tiene token en memoria, no necesita refresh
    if (authStore.isAuthenticated()) {
      setAuthenticated(true)
      setChecking(false)
      return
    }

    // Intentar renovar con la cookie del refresh token
    fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No session")
        return res.json()
      })
      .then((data) => {
        authStore.setToken(data.access)
        setAuthenticated(true)
      })
      .catch(() => {
        setAuthenticated(false)
      })
      .finally(() => {
        setChecking(false)
      })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Cargando...</p>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}