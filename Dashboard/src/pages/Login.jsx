import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await login(username, password);

    if (!res.success) {
      setError(res.message);
      return;
    }

    // Redirect berdasarkan ROLE
    if (res.role === "FKTP") navigate("/dashboard-fktp");
    else if (res.role === "BPJS") navigate("/dashboard-bpjs");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#142150] px-4">
      <AuthCard>
        <h3 className="text-[17px] font-semibold text-gray-800 mb-6">
          Please enter your account details
        </h3>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        {/* Username */}
        <label className="text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Input your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-teal-600"
        />

        {/* Password */}
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="Input your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 mb-6 px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-teal-600"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-4 text-gray-500"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Sign In
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-600 font-semibold">
            Register
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
