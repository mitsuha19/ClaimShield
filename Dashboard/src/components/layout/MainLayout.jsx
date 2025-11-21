import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarMonitor from "./SidebarMonitor";
import Topbar from "./Topbar";
import { useAuth } from "../../auth/AuthContext";

export default function MainLayout({ children }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Sidebar (role)
  const SidebarComponent = user?.role === "BPJS" ? SidebarMonitor : Sidebar;

  // Dashboard (role)
  const dashboardPath = user?.role === "BPJS"
    ? "/dashboard-bpjs"
    : "/dashboard-fktp";

  // Default breadcrumb
  let breadcrumb = [
    { label: "Dashboard", path: dashboardPath, active: pathname === dashboardPath }
  ];

  if (pathname === "/add") {
    breadcrumb = [
      { label: "Dashboard", path: dashboardPath, active: false },
      { label: "Tambah Pengajuan", path: "/add", active: true },
    ];
  } else if (pathname === "/edit") {
    breadcrumb = [
      { label: "Dashboard", path: dashboardPath, active: false },
      { label: "Edit Pengajuan", path: "/edit", active: true },
    ];
  } else if (pathname === "/detail") {
    breadcrumb = [
      { label: "Dashboard", path: dashboardPath, active: false },
      { label: "Detail Pengajuan", path: "/detail", active: true },
    ];
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarComponent />

      <div className="flex-1 flex flex-col">
        <Topbar items={breadcrumb} />

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
