import { useEffect, useMemo, useState } from "react";
import Button from "../components/assets/Button";
import Table from "../components/assets/Table";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";

const DASHBOARD_API_BASE = "http://localhost:3000/api";

export default function FKTP() {
  const navigate = useNavigate();
  const { pengajuan, deletePengajuan } = useData();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Index pengajuan lokal by id (buat nyari nama/layanan dari dummy)
  const pengajuanById = useMemo(() => {
    const map = {};
    pengajuan.forEach((p) => {
      if (p.id != null) {
        map[p.id.toString()] = p;
      }
    });
    return map;
  }, [pengajuan]);

  // ======== FETCH SEMUA KLAIM DARI DB ========
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
        setClaims(Array.isArray(json.data) ? json.data : []);
        setError("");
      } catch (err) {
        console.error("Error fetch claims list:", err);
        setError(err.message || "Gagal memuat data klaim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // ======== HANDLE DELETE (HAPUS DI DB + LOKAL) ========
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus klaim ini?")) return;

    try {
      const res = await fetch(`${DASHBOARD_API_BASE}/claims/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Gagal menghapus klaim di dashboard: ${res.status} ${text || ""}`
        );
      }

      // Hapus dari list lokal dashboard
      setClaims((prev) => prev.filter((c) => c.id !== id));

      // Hapus juga dari state pengajuan (dummy/local) kalau ada
      deletePengajuan(id);

      alert("Klaim berhasil dihapus ✅");
    } catch (err) {
      console.error("❌ Error delete claim:", err);
      alert("Gagal menghapus klaim: " + err.message);
    }
  };

  // ======== DEFINISI KOLOM TABLE ========
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

          {/* Edit */}
          <button
            className="text-teal-600 hover:text-teal-800"
            onClick={() => navigate(`/edit?id=${row.id}`)}
          >
            <Pencil size={18} />
          </button>

          {/* Delete */}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // ======== MAPPING DB ROW → ROW TABLE UI ========
  const statusLabelMap = {
    pending: "Menunggu Validasi",
    validate: "Tervalidasi",
    approve: "Disetujui",
    rejected: "Ditolak",
  };

  const data = claims.map((c) => {
    const id = c.id?.toString();
    const local = id ? pengajuanById[id] : null;

    // createdAt: coba pakai createdAt/created_at dari DB, fallback ke tanggal_pelayanan atau timestamp lokal
    const rawCreated =
      c.createdAt ||
      c.created_at ||
      c.tanggal_pelayanan ||
      local?.timestamp ||
      "";
    const createdAt =
      typeof rawCreated === "string" && rawCreated.length >= 10
        ? rawCreated
        : rawCreated || "-";

    // Nama peserta: sementara pakai peserta_id, atau nama dari dummy kalau ada
    const name = local?.nama || c.peserta_id || "-";

    // Deskripsi layanan
    const service = c.jenis_layanan || local?.layanan || "-";

    const statusRaw = c.status || "pending";
    const status = statusLabelMap[statusRaw] || statusRaw;

    return {
      id,
      createdAt,
      name,
      service,
      status,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header + Tombol */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <Button onClick={() => navigate("/add")}>+ Tambah Pengajuan</Button>
      </div>

      {/* Error / Loading / Table */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <p>Memuat data klaim...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">Belum ada pengajuan klaim.</p>
        ) : (
          <Table columns={columns} data={data} />
        )}
      </div>
    </div>
  );
}
