import { NavLink, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide transition ${
    isActive ? "text-white" : "text-slate-400 hover:text-slate-100"
  }`;

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-tight text-white"
        >
          Emotion Atlas
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={navClass}>
            Predict
          </NavLink>
          {!token ? (
            <NavLink
              to="/register"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create account
            </NavLink>
          ) : (
            <button
              onClick={logout}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
