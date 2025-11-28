// src/layouts/Sidebar/SidebarMonitor.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, AlertTriangle, History } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function SidebarMonitor() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const baseLinkClass =
    "flex gap-3 items-center px-3 py-2 rounded-lg mb-2 text-sm";

  return (
    <div className="w-64 bg-white shadow flex flex-col">
      {/* Isi sidebar */}
      <div className="p-4 flex-1 overflow-auto">
        <img src="/bpjs.png" className="h-20 mx-auto mb-6" alt="BPJS" />

        {/* Dashboard */}
        <NavLink
          to="/dashboard-bpjs"
          className={({ isActive }) =>
            `${baseLinkClass} ${
              isActive
                ? "bg-[#E7F4F8] text-teal-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Laporan klaim palsu */}
        <NavLink
          to="/fraud-reports"
          className={({ isActive }) =>
            `${baseLinkClass} ${
              isActive
                ? "bg-[#FDECEF] text-red-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <AlertTriangle size={18} />
          <span>Laporan Klaim Palsu</span>
        </NavLink>

        {/* Riwayat klaim di Blockchain */}
        <NavLink
          to="/claim-history"
          className={({ isActive }) =>
            `${baseLinkClass} ${
              isActive
                ? "bg-[#EEF2FF] text-indigo-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <History size={18} />
          <span>Riwayat Klaim</span>
        </NavLink>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2
          mx-4 mb-4
          px-3 py-2
          text-red-600 font-medium
          bg-red-50
          rounded-lg
          hover:bg-red-100
          transition
        "
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
