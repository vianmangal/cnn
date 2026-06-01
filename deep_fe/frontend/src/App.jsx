import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Predict from "./pages/Predict.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-10">
        <Routes>
          <Route path="/" element={<Predict />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
