import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  let breadcrumb = [{ label: "Dashboard", path: "/dashboard-fktp", active: pathname === "/dashboard-fktp" }];

  if (pathname === "/add") {
    breadcrumb = [
      { label: "Dashboard", path: "/dashboard-fktp", active: false },
      { label: "Tambah Pengajuan", path: "/add", active: true },
    ];
  }

  if (pathname === "/edit") {
    breadcrumb = [
      { label: "Dashboard", path: "/dashboard-fktp", active: false },
      { label: "Edit Pengajuan", path: "/edit", active: true },
    ];
  }

  if (pathname === "/detail") {
    breadcrumb = [
      { label: "Dashboard", path: "/dashboard-fktp", active: false },
      { label: "Detail Pengajuan", path: "/detail", active: true },
    ];
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Topbar items={breadcrumb} />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
