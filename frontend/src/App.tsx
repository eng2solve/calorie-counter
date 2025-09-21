import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Ensure that ./pages/Login.tsx or ./pages/Login/index.tsx exists and is correctly named
import Signup from "./pages/Signup";
import GetCalories from "./pages/GetCalories";
import { useAuthStore } from "./stores/authStore";
import Footer from "./Footer";

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuthStore((s) => s.token);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={token ? <Navigate to="/get-calories" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/get-calories"
          element={
            <PrivateRoute>
              <GetCalories />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer/>
    </div>
    
  );
}
