import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow min-h-screen p-4 flex flex-col">
      <div className="flex-1">
        <img src="/fktp.png" className="h-20 mx-auto mb-6" />

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex gap-3 items-center px-3 py-2 rounded-lg mb-2
            ${isActive ? "bg-[#E7F4F8] text-teal-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
      </div>

      <button
        className="
          flex items-center gap-2
          px-3 py-2
          text-red-600 font-medium
          bg-red-50
          rounded-lg
          hover:bg-red-100
          transition
          mt-auto
        "
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
