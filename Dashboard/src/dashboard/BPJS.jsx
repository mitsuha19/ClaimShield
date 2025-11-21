import { useState } from "react";
import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Eye, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BPJS() {
  const navigate = useNavigate();

  // === STATE POPUP ===
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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
            title="Detail"
          >
            <Eye size={18} />
          </button>

          {/* Approve */}
          {row.status === "Menunggu" && (
            <button
              className="text-green-600 hover:text-green-800"
              onClick={() => {
                setSelectedRow(row);
                setShowApprove(true);
              }}
              title="Approve"
            >
              <Check size={18} />
            </button>
          )}

          {/* Reject */}
          {row.status === "Menunggu" && (
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setSelectedRow(row);
                setShowReject(true);
              }}
              title="Tolak"
            >
              <X size={18} />
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

      {/* ========== POPUP APPROVE ========== */}
      {showApprove && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowApprove(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-center">
              Apakah anda yakin Menerima ?
            </h2>

            <p className="text-gray-500 text-sm text-center mt-2">
              Menerima Pengajuan akan permanen dari penyimpanan data.
              Aksi tersebut tidak bisa dikembalikan.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => setShowApprove(false)}
              >
                Tidak, batal
              </button>

              <button
                className="flex-1 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
                onClick={() => {
                  console.log("Approved:", selectedRow);
                  setShowApprove(false);
                }}
              >
                Ya, konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== POPUP REJECT ========== */}
      {showReject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] relative">

            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReject(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-center">
              Masukkan Feedback / Alasan Penolakan
            </h2>

            <textarea
              className="w-full mt-4 p-3 border rounded bg-gray-100"
              rows="3"
              placeholder="Layanan pasien tidak sesuai dengan keluhan pasien"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => setShowReject(false)}
              >
                Batal Penolakan
              </button>

              <button
                className="flex-1 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
                onClick={() => {
                  console.log("Rejected:", selectedRow, "Reason:", rejectReason);
                  setShowReject(false);
                  setRejectReason("");
                }}
              >
                Kirim Penolakan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
