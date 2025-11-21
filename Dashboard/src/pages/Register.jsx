import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <AuthCard>
        <h3 className="text-lg font-semibold text-gray-600 mb-6">
          Please enter your account details
        </h3>

        {/* Email */}
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Input your email"
          className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg focus:outline-teal-600"
        />

        {/* Create Password */}
        <label className="text-sm font-medium text-gray-700">
          Create Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Input your password"
            className="w-full mt-1 mb-4 px-3 h-11 border rounded-lg focus:outline-teal-600"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 translate-y-[-6px]"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {/* Confirm Password */}
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            className="w-full mt-1 mb-6 px-3 h-11 border rounded-lg focus:outline-teal-600"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 translate-y-[-10px]"
          >
            {showConfirm ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </span>
        </div>

        {/* Button */}
        <button className="w-full bg-teal-600 hover:bg-teal-700 transition text-white font-semibold py-2 rounded-lg">
          Sign Up
        </button>

        {/* Already have an account? */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-semibold">
            Login
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}