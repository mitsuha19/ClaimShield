import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function SidebarMonitor() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="w-64 bg-white shadow flex flex-col">
      {/* Isi sidebar */}
      <div className="p-4 flex-1 overflow-auto">
        <img src="/bpjs.png" className="h-20 mx-auto mb-6" />

        <NavLink
          to="/dashboard-bpjs"
          className={({ isActive }) =>
            `flex gap-3 items-center px-3 py-2 rounded-lg mb-2
            ${isActive ? "bg-[#E7F4F8] text-teal-600" : "text-gray-700 hover:bg-gray-100"}`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Tambahkan link lain di sini */}
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
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
