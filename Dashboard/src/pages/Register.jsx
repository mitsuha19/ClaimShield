import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function Register() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#142150] px-4">
      <AuthCard>
        <h3 className="text-[17px] font-semibold text-gray-800 mb-6">
          Please enter your account details
        </h3>

        {/* Email */}
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Input your email"
          className="w-full mt-1 mb-4 px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-teal-600"
        />

        {/* Create Password */}
        <label className="text-sm font-medium text-gray-700">
          Create Password
        </label>
        <div className="relative">
          <input
            type={show1 ? "text" : "password"}
            placeholder="Input your password"
            className="w-full mt-1 mb-4 px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-teal-600"
          />
          <button
            type="button"
            onClick={() => setShow1(!show1)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={show2 ? "text" : "password"}
            placeholder="Input your password"
            className="w-full mt-1 mb-6 px-3 py-2 border border-gray-300 rounded-lg focus-visible:outline-teal-600"
          />
          <button
            type="button"
            onClick={() => setShow2(!show2)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition">
          Sign Up
        </button>

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
