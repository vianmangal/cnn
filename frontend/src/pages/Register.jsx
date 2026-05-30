import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await client.post("/auth/register", { email, password });
      login(response.data.access_token);
      navigate("/history");
    } catch (err) {
      setError("Registration failed. Try a new email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
      <h2 className="font-display text-2xl font-semibold text-white">Join Emotion Atlas</h2>
      <p className="text-sm text-slate-400">Create an account to save predictions.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
          required
        />
        {error ? (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-900"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <div className="mt-4 text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-white">
          Log in
        </Link>
      </div>
    </div>
  );
}
