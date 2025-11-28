import { useEffect, useState } from "react";
import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DASHBOARD_API_BASE = "http://localhost:3000/api";

export default function BPJS() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil semua klaim dari BE dashboard
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${DASHBOARD_API_BASE}/claims`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Gagal mengambil data klaim: ${res.status} ${text || ""}`
          );
        }

        const json = await res.json();
        const claims = Array.isArray(json.data) ? json.data : [];

        const statusLabelMap = {
          pending: "Menunggu",
          validate: "Tervalidasi",
          approve: "Disetujui",
          rejected: "Ditolak",
        };

        const mapped = claims.map((c) => {
          const id = c.id?.toString();

          const rawTs =
            c.createdAt ||
            c.created_at ||
            c.tanggal_pelayanan ||
            c.updatedAt ||
            c.updated_at ||
            "";

          const timestamp =
            typeof rawTs === "string" && rawTs.length >= 10
              ? rawTs
              : rawTs || "-";

          const statusCode = c.status || "pending";
          const statusLabel = statusLabelMap[statusCode] || statusCode;

          return {
            id,
            timestamp,
            // Sementara hardcode nama; nanti bisa diganti ke c.nama_peserta kalau sudah ada di DB
            nama: "Jonathan Siregar",
            layanan: c.jenis_layanan || "-",
            status: statusLabel, // label untuk tabel
            statusCode, // raw status untuk logic ikon
          };
        });

        setList(mapped);
        setError("");
      } catch (err) {
        console.error("Error fetch BPJS claims:", err);
        setError(err.message || "Gagal memuat data klaim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
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
          {/* Jika sudah approve → hanya bisa lihat */}
          {row.statusCode === "approve" ? (
            <button
              className="text-blue-600"
              onClick={() => navigate(`/detail-bpjs?id=${row.id}`)}
            >
              <Eye size={18} />
            </button>
          ) : (
            // Kalau masih pending / validate → masuk ke detail untuk review + approve/tolak
            <button
              className="text-teal-600"
              onClick={() => navigate(`/detail-bpjs?id=${row.id}`)}
            >
              <Pencil size={18} />
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
        {loading ? (
          <p>Memuat data klaim...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">Belum ada pengajuan klaim.</p>
        ) : (
          <Table columns={columns} data={list} />
        )}
      </div>
    </div>
  );
}
