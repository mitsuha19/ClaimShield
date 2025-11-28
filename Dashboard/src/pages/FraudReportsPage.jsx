// src/pages/FraudReportsPage.jsx
import { useEffect, useState } from "react";
import Table from "../components/assets/Table";
import Button from "../components/assets/Button";

const DASHBOARD_API_BASE = "http://localhost:3000/api";

export default function FraudReportsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${DASHBOARD_API_BASE}/claim-mismatch-reports`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Gagal mengambil laporan klaim palsu: ${res.status} ${text || ""}`
          );
        }

        const json = await res.json();
        const reports = Array.isArray(json.data) ? json.data : [];

        const statusLabelMap = {
          pending: "Pending",
          in_review: "Dalam Penelaahan",
          resolved: "Selesai",
          rejected: "Ditolak",
        };

        const mapped = reports.map((r) => {
          const rawCreated = r.createdAt || r.created_at;
          let createdAt = "-";

          if (rawCreated) {
            const d = new Date(rawCreated);
            createdAt = isNaN(d.getTime())
              ? rawCreated.toString().slice(0, 19).replace("T", " ")
              : d.toLocaleString("id-ID");
          }

          const statusCode = r.status || "pending";
          const statusLabel = statusLabelMap[statusCode] || statusCode;

          return {
            id: r.id,
            createdAt,
            claimCode: r.claim_code,
            pesertaId: r.peserta_id,
            reason: r.reason,
            status: statusLabel,
          };
        });

        setList(mapped);
        setError("");
      } catch (err) {
        console.error("Error fetch fraud reports:", err);
        setError(err.message || "Gagal memuat laporan klaim palsu");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const columns = [
    { title: "Tanggal Laporan", key: "createdAt" },
    { title: "Claim Code", key: "claimCode" },
    { title: "Peserta ID", key: "pesertaId" },
    {
      title: "Alasan Pelaporan",
      key: "reason",
      render: (value) =>
        value && value.length > 80 ? value.slice(0, 80) + "..." : value || "-",
    },
    { title: "Status", key: "status" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Laporan Klaim Palsu</h1>
          <p className="text-sm text-gray-500">
            Daftar laporan peserta yang menyatakan klaim BPJS bukan milik
            mereka.
          </p>
        </div>
        <Button type="button" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
          <p>Memuat laporan klaim palsu...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">
            Belum ada laporan klaim palsu yang masuk.
          </p>
        ) : (
          <Table columns={columns} data={list} />
        )}
      </div>
    </div>
  );
}
