import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";

export function App() {
  const token = useAuthStore((state) => state.token);
  const restoreToken = useAuthStore((state) => state.restoreToken);

  useEffect(() => {
    // Restore token from localStorage on app load
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && !token) {
      restoreToken(storedToken);
    }
  }, [token, restoreToken]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
