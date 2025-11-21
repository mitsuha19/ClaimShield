import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FKTP() {
  const navigate = useNavigate();

  const columns = [
    { title: "Tanggal/Waktu Pengajuan", key: "createdAt" },
    { title: "Nama Peserta", key: "name" },
    { title: "Deskripsi Layanan", key: "service" },
    { title: "Status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex gap-3 items-center">
          {/* Detail */}
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/detail")}
          >
            <Eye size={18} />
          </button>

          {/* Jika status masih Menunggu → tampilkan edit + delete */}
          {row.status === "Menunggu" && (
            <>
              <button
                className="text-teal-600 hover:text-teal-800"
                onClick={() => navigate("/edit")}
              >
                <Pencil size={18} />
              </button>

              <button className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const data = [
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Lana Bakkery",
      service: "J06.9 – Infeksi Saluran Pernapasan Atas",
      status: "Menunggu",
    },
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Jakob Sipaе",
      service: "J06.9 – Infeksi Saluran Pernapasan Atas",
      status: "Menunggu",
    },
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Timoty Ronald",
      service: "J06.9 – Infeksi Saluran Pernapasan Atas",
      status: "Diterima",
    },
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Fuufufafaa",
      service: "J06.9 – Infeksi Saluran Pernapasan Atas",
      status: "Diterima",
    },
    {
      createdAt: "24 Jan 2025 - 10:12:48 WIB",
      name: "Laamsio",
      service: "J06.9 – Infeksi Saluran Pernapasan Atas",
      status: "Diterima",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header + Tombol */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <Button onClick={() => navigate("/add")}>
          + Tambah Pengajuan
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <Table columns={columns} data={data} />
      </div>

    </div>
  );
}
