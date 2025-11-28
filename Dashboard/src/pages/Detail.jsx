import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useData } from "../auth/DataContext";

const DASHBOARD_API_BASE = "http://localhost:3000/api";

export default function Detail() {
  const navigate = useNavigate();
  const { pengajuan } = useData();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil detail klaim dari BE dashboard
  useEffect(() => {
    if (!id) {
      setError("ID klaim tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchClaim = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${DASHBOARD_API_BASE}/claims/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Gagal mengambil data klaim: ${res.status} ${text || ""}`
          );
        }
        const json = await res.json();
        setClaim(json.data);
        setError("");
      } catch (err) {
        console.error("Error fetch claim detail:", err);
        setError(err.message || "Gagal memuat data klaim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  const local = pengajuan.find(
    (item) =>
      item.id?.toString() === id?.toString() ||
      item.claimCode === claim?.claim_code
  );
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Detail Pengajuan
        </h1>
        <p>Memuat data klaim...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Detail Pengajuan
        </h1>
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => navigate("/dashboard-fktp")}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!claim && !local) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Detail Pengajuan
        </h1>
        <p>Data pengajuan tidak ditemukan.</p>
        <button
          onClick={() => navigate("/dashboard-fktp")}
          className="mt-4 px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  // ==== Mapping data dari DB + fallback lokal ====
  const idKlaim = claim?.claim_code || local?.id || "-";
  const pesertaID = claim?.peserta_id || local?.pesertaID || "-";
  const fktpID = claim?.fktp_id || local?.fktpID || "-";
  const tanggalPelayanan =
    claim?.tanggal_pelayanan || local?.timestamp?.slice(0, 10) || "-";

  const layanan =
    claim?.jenis_layanan || local?.layanan || "Layanan tidak diketahui";
  const poli = claim?.poli || "-";
  const dokter = claim?.dokter_penanggung_jawab || "-";

  const diagnosaUtama = claim?.diagnosa_utama || "";
  const diagnosaTambahan = claim?.diagnosa_tambahan || "";
  const resumeKeluhan = claim?.resume_keluhan || "";
  const terapiObat = claim?.terapi_obat || "";

  const status = claim?.status || "pending";

  const statusLabelMap = {
    pending: "Menunggu Validasi",
    validate: "Tervalidasi",
    approve: "Disetujui",
    rejected: "Ditolak",
  };
  const statusLabel = statusLabelMap[status] || status;

  let statusColor = "text-gray-600";
  if (status === "pending") statusColor = "text-yellow-600";
  else if (status === "validate") statusColor = "text-blue-600";
  else if (status === "approve") statusColor = "text-emerald-600";
  else if (status === "rejected") statusColor = "text-red-600";

  const riwayat = local?.riwayat || [];
  const rekamMedis = local?.rekam_medis || [];

  return (
    <div className="p-6 overflow-x-hidden">
      <h1 className="text-2xl font-bold text-teal-700 mb-1">
        Detail Pengajuan
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        ID Klaim: <span className="font-semibold">{idKlaim}</span> · Peserta ID:{" "}
        <span className="font-semibold">{pesertaID}</span> · FKTP:{" "}
        <span className="font-semibold">{fktpID}</span> · Tanggal:{" "}
        <span className="font-semibold">{tanggalPelayanan}</span>
      </p>

      {/* Data Peserta */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div className="flex">
            <p className="w-48 font-medium">Peserta ID</p>
            <p className="mr-2">:</p>
            <p>{pesertaID}</p>
          </div>
          <div className="flex">
            <p className="w-48 font-medium">FKTP ID</p>
            <p className="mr-2">:</p>
            <p>{fktpID}</p>
          </div>
          <div className="flex">
            <p className="w-48 font-medium">Tanggal Pelayanan</p>
            <p className="mr-2">:</p>
            <p>{tanggalPelayanan}</p>
          </div>
          <div className="flex">
            <p className="w-48 font-medium">Status Kepesertaan</p>
            <p className="mr-2">:</p>
            <p>Aktif</p>
          </div>
          <div className="flex">
            <p className="w-48 font-medium">Kelas Perawatan</p>
            <p className="mr-2">:</p>
            <p>Kelas 3</p>
          </div>
          <div className="flex">
            <p className="w-48 font-medium">Eligibility Layanan</p>
            <p className="mr-2">:</p>
            <p>Eligible (Rawat Jalan)</p>
          </div>
        </div>
      </div>

      {/* Riwayat Layanan (dari dummy/local) */}
      {riwayat.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm">
            {riwayat.map((r, index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-medium">
                  {r.fasilitas} ({r.tanggal})
                </p>

                <p className="font-semibold mt-2">Diagnosa Pelayanan</p>
                <p>{r.diagnosa}</p>

                <p className="font-bold mt-2">Keluhan</p>
                <p>{r.keluhan}</p>

                <p className="font-bold mt-2">Terapi Obat</p>
                <p>{r.terapi}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riwayat Rekam Medis (dari dummy/local) */}
      {rekamMedis.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm">
            {rekamMedis.map((r, index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-medium">
                  {r.fasilitas} ({r.tanggal})
                </p>

                <p className="font-semibold mt-2">Tindakan Medis</p>
                <p>{r.tindakan}</p>

                <p className="font-bold mt-2">Hasil Pemeriksaan</p>
                <p>{r.hasil}</p>

                <p className="font-bold mt-2">Catatan Dokter</p>
                <p>{r.catatan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Layanan + Diagnosa + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_2fr_1fr] gap-6 mb-6 overflow-x-hidden">
        {/* Informasi Layanan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                value={layanan}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                value={poli}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dokter Penanggung Jawab
              </label>
              <input
                type="text"
                value={dokter}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input
                type="date"
                value={
                  tanggalPelayanan && tanggalPelayanan !== "-"
                    ? tanggalPelayanan
                    : ""
                }
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">
                Surat Eligibilitas Peserta
              </label>
              <input
                type="file"
                disabled
                className="mt-1 block w-full text-sm text-gray-500 cursor-not-allowed opacity-70
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:bg-gray-300 file:text-gray-600 file:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Diagnosa & Tindakan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa & Tindakan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Diagnosa Utama (ICD-10)
              </label>
              <input
                type="text"
                value={diagnosaUtama}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input
                type="text"
                value={diagnosaTambahan}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea
                className="w-full border rounded p-2 h-20 bg-gray-100"
                value={resumeKeluhan}
                disabled
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea
                className="w-full border rounded p-2 h-20 bg-gray-100"
                value={terapiObat}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Status Klaim */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div
            className={`p-3 rounded bg-gray-100 text-center font-semibold ${statusColor}`}
          >
            {statusLabel}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/dashboard-fktp")}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
