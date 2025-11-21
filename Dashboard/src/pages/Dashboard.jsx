import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate()
  const columns = [
    { title: "Tanggal/Waktu Pengajuan", key: "createdAt" },
    { title: "Nama Peserta", key: "name" },
    { title: "Deskripsi Layanan", key: "service" },
    { title: "Status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex gap-2">

          <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate("/detail")}>
            <Eye size={18} />
          </button>

          {row.status === "Menunggu" && (
            <>
              <button className="text-teal-600 hover:text-teal-800" onClick={() => navigate("/edit")} > 
                <Pencil size={18} /> 
              </button>

              <button className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </>
          )}

          {row.status === "Ditolak" && (
            <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate("/detail")}>
            <Eye size={18} />
           </button>
          )}
        </div>
      ),
    },
  ];

  const data = [
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Lana Bakkery",
      service: "J06.9 - Infeksi Saluran Pernapasan Atas",
      status: "Menunggu",
    },
    {
      createdAt: "25 Jan 2025 - 09:20:11 WIB",
      name: "Budi Santoso",
      service: "A09.0 - Infeksi Saluran Cerna",
      status: "Menunggu",
    },
    {
      createdAt: "26 Jan 2025 - 14:42:05 WIB",
      name: "Putri Maharani",
      service: "R51 - Nyeri Kepala",
      status: "Diterima",
    },
    {
      createdAt: "27 Jan 2025 - 11:30:22 WIB",
      name: "Rama Wijaya",
      service: "I10 - Hipertensi Esensial",
      status: "Diterima",
    },
    {
      createdAt: "28 Jan 2025 - 08:55:13 WIB",
      name: "Siti Rohani",
      service: "E11 - Diabetes Mellitus Tipe 2",
      status: "Menunggu",
    },

  ];

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <Button onClick={() => navigate("/add")}>
          + Tambah Pengajuan
        </Button>
      </div>

      <Table columns={columns} data={data} />
    </>
  );
}
