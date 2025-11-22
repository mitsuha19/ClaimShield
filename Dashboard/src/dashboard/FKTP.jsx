import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";

export default function FKTP() {
  const navigate = useNavigate();
  const { pengajuan, deletePengajuan } = useData();

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
            onClick={() => navigate(`/detail?id=${row.id}`)}
          >
            <Eye size={18} />
          </button>

          {/* Edit + Delete */}
          <button
            className="text-teal-600 hover:text-teal-800"
            onClick={() => navigate(`/edit?id=${row.id}`)}
          >
            <Pencil size={18} />
          </button>

          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => deletePengajuan(row.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // mapping dari struktur klaim → struktur table
  const data = pengajuan.map((item) => ({
    id: item.id,
    createdAt: item.timestamp,
    name: item.nama,
    service: item.layanan,
    status: "Menunggu",
  }));

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
