import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Predict from "./pages/Predict.jsx";
import Register from "./pages/Register.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
