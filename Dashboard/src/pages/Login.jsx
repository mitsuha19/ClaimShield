import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const result = login(email, password);

    if (!result.success) {
      alert("Email atau password salah!");
      return;
    }

    if (result.role === "petugas") navigate("/dashboard-fktp");
    if (result.role === "monitoring") navigate("/dashboard-bpjs");
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <AuthCard>
        <h3 className="text-l font-semibold text-gray-600 mb-6">
          Please enter your account details
        </h3>

        {/* Email */}
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Input your email"
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg focus:outline-teal-600"
        />

        {/* Password */}
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Input your password"
            className="w-full mt-1 mb-6 px-3 h-11 border rounded-lg focus:outline-teal-600"
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 translate-y-[-6px]"
          >
            {show ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-2 rounded-lg"
        >
          Sign In
        </button>

        {/* Footer */}
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
