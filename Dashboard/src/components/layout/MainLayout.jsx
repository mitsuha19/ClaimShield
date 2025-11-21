import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  let breadcrumb = [
    { label: "Dashboard", path: "/", active: pathname === "/" }
  ];

  if (pathname === "/add") {
    breadcrumb = [
      { label: "Dashboard", path: "/", active: false },
      { label: "Tambah Pengajuan", path: "/add", active: true }
    ];
  }
  if (pathname.startsWith("/edit")) {
    breadcrumb = [
      { label: "Dashboard", path: "/", active: false },
      { label: "Edit Pengajuan", path: pathname, active: true }
    ];  
  }
  if (pathname.startsWith("/detail")) {
    breadcrumb = [
      { label: "Dashboard", path: "/", active: false },
      { label: "Detail Pengajuan", path: pathname, active: true }
    ];  
  }

  return (
    <div className="flex">
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
