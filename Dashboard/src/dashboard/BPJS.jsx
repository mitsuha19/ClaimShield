import { useEffect, useState } from "react";
import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bpjsDummy } from "../utils/bpjsDummy";

export default function BPJS() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("bpjs-data");

    if (stored) {
      setList(JSON.parse(stored));
    } else {
      localStorage.setItem("bpjs-data", JSON.stringify(bpjsDummy));
      setList(bpjsDummy);
    }
  }, []);

  const columns = [
    { title: "Tanggal/Waktu Pengajuan", key: "timestamp" },
    { title: "Nama Peserta", key: "nama" },
    { title: "Deskripsi Layanan", key: "layanan" },
    { title: "Status", key: "status" },

    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex gap-3 items-center">
          {row.status === "Menunggu" ? (
            <button
              className="text-teal-600"
              onClick={() => navigate(`/detail-bpjs?id=${row.id}`)}
            >
              <Pencil size={18} />
            </button>
          ) : (
            <button
              className="text-blue-600"
              onClick={() => navigate(`/detail-bpjs?id=${row.id}`)}
            >
              <Eye size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard BPJS</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <Table columns={columns} data={list} />
      </div>
    </div>
  );
}
