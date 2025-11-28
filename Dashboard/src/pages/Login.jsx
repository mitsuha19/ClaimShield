import { useState } from "react";
import { Eye, EyeOff, User2, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthCard from "../components/AuthCard";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setSubmitting(true);
    const res = await login(username, password);
    setSubmitting(false);

    if (!res.success) {
      setError(res.message || "Login gagal. Periksa kembali akun Anda.");
      return;
    }

    // Redirect berdasarkan ROLE
    if (res.role === "FKTP") navigate("/dashboard-fktp");
    else if (res.role === "BPJS") navigate("/dashboard-bpjs");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#0B102A] via-[#0D1538] to-[#06121F] px-4">
      {/* Glow dekorasi */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-32 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-80px] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <AuthCard>
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-medium text-teal-700 mb-3">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              ClaimShield Portal
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masuk dengan akun <span className="font-semibold">FKTP</span> atau{" "}
              <span className="font-semibold">BPJS</span> Anda.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Username
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User2 size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Input your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 pl-9 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LockKeyhole size={16} />
                </span>
                <input
                  type={show ? "text" : "password"}
                  placeholder="Input your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 pl-9 pr-9 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                />

                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Info role / register */}
          <div className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Role: FKTP
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Role: BPJS
              </span>
            </div>
            <p className="text-[11px]">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-teal-600 hover:text-teal-700"
              >
                Register
              </Link>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
