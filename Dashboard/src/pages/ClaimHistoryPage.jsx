// src/pages/ClaimHistoryPage.jsx
import React, { useState } from "react";

const BC_API_BASE = "http://localhost:4000/api";

export default function ClaimHistoryPage() {
  const [searchId, setSearchId] = useState("KLAIM-001");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFetchHistory(e) {
    e?.preventDefault();

    const id = (searchId || "").trim();
    if (!id) {
      alert("Isi ID klaim terlebih dahulu (contoh: KLAIM-001)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHistory([]);

      const res = await fetch(
        `${BC_API_BASE}/claims/${encodeURIComponent(id)}/history`
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gagal mengambil riwayat: ${res.status} ${text || ""}`);
      }

      const json = await res.json();
      const raw = Array.isArray(json.history) ? json.history : [];

      const mapped = raw.map((item, idx) => {
        // ✅ payload claim ada di 'data'
        const value = item.data || item.Value || item.value || {};

        const txId = item.txId || item.TxId || `#${idx + 1}`;

        // timestamp (seconds → local string)
        let tsLabel = "-";
        const ts = item.timestamp || item.Timestamp;
        if (ts && typeof ts === "object") {
          const sec = ts.seconds || ts.Seconds || ts._seconds;
          if (sec) {
            const d = new Date(Number(sec) * 1000);
            tsLabel = d.toLocaleString("id-ID", {
              dateStyle: "short",
              timeStyle: "medium",
              hour12: false,
            });
          }
        }

        // status & approvedBy dari payload data
        const statusRaw = value.status || value.Status || "-"; // Pending / Validated / Approved
        const approvedBy =
          value.approvedBy || value.approved_by || value.approver || "";

        const status = statusRaw;

        let payload = "";
        try {
          payload = JSON.stringify(value);
        } catch (_) {
          payload = String(value);
        }
        if (payload.length > 120) {
          payload = payload.slice(0, 120) + "...";
        }

        return {
          no: idx + 1,
          txId,
          timestamp: tsLabel,
          status,
          approvedBy: approvedBy || "-",
          payload,
        };
      });

      // Biar paling baru di atas: history[0] = transaksi terakhir
      mapped.reverse();
      setHistory(mapped);
    } catch (err) {
      console.error("Error fetch claim history:", err);
      setError(err.message || "Gagal memuat riwayat klaim");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Klaim</h1>
          <p className="text-sm text-gray-600">
            Lihat riwayat perubahan status klaim yang tercatat di Blockchain
            (Hyperledger Fabric).
          </p>
        </div>
      </div>

      {/* Form cari klaim */}
      <form
        onSubmit={handleFetchHistory}
        className="flex gap-3 items-center mb-4"
      >
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Masukkan ID Klaim, contoh: KLAIM-001"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
          disabled={loading}
        >
          {loading ? "Memuat..." : "Cari Riwayat"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-[#E7F4F8] text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left w-16">No</th>
              <th className="px-4 py-2 text-left">Tx ID</th>
              <th className="px-4 py-2 text-left w-56">Waktu</th>
              <th className="px-4 py-2 text-left w-40">Status</th>
              <th className="px-4 py-2 text-left w-48">Disetujui Oleh</th>
              <th className="px-4 py-2 text-left w-64">Payload</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Belum ada riwayat untuk klaim ini.
                </td>
              </tr>
            ) : (
              history.map((row) => (
                <tr key={row.txId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 align-top">{row.no}</td>
                  <td className="px-4 py-2 align-top break-all font-mono text-xs">
                    {row.txId}
                  </td>
                  <td className="px-4 py-2 align-top whitespace-nowrap">
                    {row.timestamp}
                  </td>
                  <td className="px-4 py-2 align-top">{row.status || "-"}</td>
                  <td className="px-4 py-2 align-top">
                    {row.approvedBy || "-"}
                  </td>
                  <td className="px-4 py-2 align-top text-xs text-gray-700 break-all">
                    {row.payload}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
