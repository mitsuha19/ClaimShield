import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { bpjsDummy } from "../utils/bpjsDummy";

const DASHBOARD_API_BASE = "http://localhost:3000/api";
const BC_API_BASE = "http://localhost:4000/api";
const DEMO_USER_TOKEN =
  "deI1J6AqT_qTCabHZwFrrk:APA91bH3Zbz6Huzrsj7HyDzUqlZ_p_2tN8qE3xv4-b9jEJBXlmcuJ-JH7yeQEVvKAhmJyuhskjdHnMw159cwZkpWq4OkhX-haB5KNZVJh98ef3lk5UmRR30";

export default function DetailBpjs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
        const res = await axios.get(`${DASHBOARD_API_BASE}/claims/${id}`);
        setClaim(res.data?.data || null);
        setError("");
      } catch (err) {
        console.error("Error fetch claim detail BPJS:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Gagal memuat data klaim"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

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

  if (error || !claim) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Detail Pengajuan
        </h1>
        <p className="text-red-600 mb-4">
          {error || "Data klaim tidak ditemukan."}
        </p>
        <button
          onClick={() => navigate("/dashboard-bpjs")}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  // ========= JOIN DENGAN DUMMY PESERTA =========
  // 1) Coba match peserta_id → pesertaID
  // 2) Coba match claim_code → id
  // 3) Kalau tetap tidak ada, pakai entry pertama (Jonathan) sebagai dummy peserta
  const dummy =
    bpjsDummy.find((d) => d.pesertaID === claim.peserta_id) ||
    bpjsDummy.find((d) => d.id === claim.claim_code) ||
    bpjsDummy[0];

  // ====== Mapping field dari DB & dummy ======
  const statusCode = claim.status || "pending";
  const statusLabelMap = {
    pending: "Menunggu",
    validate: "Tervalidasi",
    approve: "Disetujui",
    rejected: "Ditolak",
  };
  const statusLabel = statusLabelMap[statusCode] || statusCode;

  const pesertaID = claim.peserta_id || dummy?.pesertaID || "-";
  const fktpID = claim.fktp_id || dummy?.fktp || "-";

  const tanggalPelayanan =
    claim.tanggal_pelayanan?.slice(0, 10) ||
    dummy?.informasi_layanan?.tanggal_pelayanan ||
    dummy?.timestamp ||
    "-";

  const jenisLayanan =
    claim.jenis_layanan ||
    dummy?.informasi_layanan?.jenis_layanan ||
    dummy?.layanan ||
    "Layanan tidak diketahui";

  const poli = claim.poli || dummy?.informasi_layanan?.poli || "-";
  const dokter =
    claim.dokter_penanggung_jawab || dummy?.informasi_layanan?.dokter || "-";

  const diagnosaUtama =
    claim.diagnosa_utama || dummy?.diagnosa_tindakan?.diagnosa_utama || "";
  const diagnosaTambahan =
    claim.diagnosa_tambahan ||
    dummy?.diagnosa_tindakan?.diagnosa_tambahan ||
    "";
  const resume = claim.resume_keluhan || dummy?.diagnosa_tindakan?.resume || "";
  const terapi = claim.terapi_obat || dummy?.diagnosa_tindakan?.terapi || "";

  const nama = dummy?.nama || "—";
  const nik = dummy?.nik || "—";
  const kelas = dummy?.kelas || "—";
  const eligibility = dummy?.eligibility || "—";

  const riwayat = dummy?.riwayat || [];
  const rekamMedis = dummy?.rekam_medis || [];

  // Hanya bisa approve/reject kalau status = validate (sudah tervalidasi dari BC)
  const canAct = statusCode === "validate";

  // ====== Approve ke BC + update status DB ======
  const handleApprove = async () => {
    if (!claim) return;
    if (!claim.claim_code) {
      alert("Claim code tidak ditemukan.");
      return;
    }

    setSaving(true);
    try {
      // 1) Approve ke Blockchain (pakai claim_code)
      await axios.post(
        `${BC_API_BASE}/claims/${encodeURIComponent(claim.claim_code)}/approve`,
        {
          approvedBy: "Petugas BPJS",
          status: "Approved",
          userToken: DEMO_USER_TOKEN,
        }
      );

      // 2) Update status di DB → approve
      await axios.patch(`${DASHBOARD_API_BASE}/claims/${id}/status`, {
        status: "approve",
      });

      setClaim((prev) => (prev ? { ...prev, status: "approve" } : prev));
      setShowApprove(false);
      alert("Klaim berhasil disetujui ✅");
      navigate("/dashboard-bpjs");
    } catch (err) {
      console.error("API Approve failed:", err.response?.data || err.message);
      alert(
        "Gagal menyetujui klaim: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  // ====== Reject klaim (update status di DB) ======
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi.");
      return;
    }
    if (!claim) return;

    setSaving(true);
    try {
      await axios.patch(`${DASHBOARD_API_BASE}/claims/${id}/status`, {
        status: "rejected",
        // kalau backend nanti support alasan, bisa tambahkan field di sini
      });

      setClaim((prev) => (prev ? { ...prev, status: "rejected" } : prev));
      setShowReject(false);
      alert("Klaim berhasil ditolak.");
      navigate("/dashboard-bpjs");
    } catch (err) {
      console.error("API Reject failed:", err.response?.data || err.message);
      alert(
        "Gagal menolak klaim: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 overflow-x-hidden ">
      <h1 className="text-2xl font-bold text-teal-700 mb-1">
        Detail Pengajuan
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        ID Klaim: <b>{claim.claim_code || id}</b> · Peserta ID:{" "}
        <b>{pesertaID}</b> · FKTP: <b>{fktpID}</b> · Tanggal:{" "}
        <b>{tanggalPelayanan}</b>
      </p>

      {/* ===================== DATA PESERTA ===================== */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div>
            <b>Nama:</b> {nama}
          </div>
          <div>
            <b>NIK:</b> {nik}
          </div>
          <div>
            <b>Kelas Rawat:</b> {kelas}
          </div>
          <div>
            <b>Eligibility:</b> {eligibility}
          </div>
          <div>
            <b>Status Klaim:</b> {statusLabel}
          </div>
        </div>
      </div>

      {/* ===================== RIWAYAT LAYANAN (DUMMY) ===================== */}
      {riwayat.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {riwayat.map((r, idx) => (
              <div key={idx} className="border-b pb-3">
                <p className="font-medium">
                  {r.fasilitas} ({r.tanggal})
                </p>
                <p>
                  <b>Diagnosa:</b> {r.diagnosa}
                </p>
                <p>
                  <b>Keluhan:</b> {r.keluhan}
                </p>
                <p>
                  <b>Terapi:</b> {r.terapi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== REKAM MEDIS (DUMMY) ===================== */}
      {rekamMedis.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {rekamMedis.map((r, idx) => (
              <div key={idx} className="border-b pb-3">
                <p className="font-medium">
                  {r.fasilitas} ({r.tanggal})
                </p>
                <p>
                  <b>Tindakan:</b> {r.tindakan}
                </p>
                <p>
                  <b>Hasil:</b> {r.hasil}
                </p>
                <p>
                  <b>Catatan Dokter:</b> {r.catatan}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== INFORMASI LAYANAN + DIAGNOSA ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_2fr_1fr] gap-6 mb-6 overflow-x-hidden">
        {/* Informasi Layanan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium">Jenis Layanan</label>
              <input
                disabled
                value={jenisLayanan}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="font-medium">Poli</label>
              <input
                disabled
                value={poli}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="font-medium">Dokter</label>
              <input
                disabled
                value={dokter}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="font-medium">Tanggal Pelayanan</label>
              <input
                disabled
                value={tanggalPelayanan}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Diagnosa & Tindakan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa & Tindakan</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium">Diagnosa Utama</label>
              <input
                disabled
                value={diagnosaUtama}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="font-medium">Diagnosa Tambahan</label>
              <input
                disabled
                value={diagnosaTambahan}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium">Resume</label>
              <textarea
                disabled
                className="w-full border rounded p-2 bg-gray-100 h-20"
                value={resume}
              />
            </div>

            <div className="col-span-2">
              <label className="font-medium">Terapi Obat</label>
              <textarea
                disabled
                className="w-full border rounded p-2 bg-gray-100 h-20"
                value={terapi}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div
            className={`p-3 rounded text-center font-semibold ${
              statusCode === "approve"
                ? "bg-green-100 text-green-700"
                : statusCode === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-teal-600"
            }`}
          >
            {statusLabel}
          </div>
        </div>
      </div>

      {/* ===================== TOMBOL AKSI (APPROVE / REJECT) ===================== */}
      {canAct && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            onClick={() => setShowReject(true)}
          >
            Tolak
          </button>

          <button
            className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
            onClick={() => setShowApprove(true)}
          >
            Terima
          </button>
        </div>
      )}

      {/* ===================== POPUP APPROVE ===================== */}
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
              Menerima pengajuan akan permanen dan tidak bisa dibatalkan.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => setShowApprove(false)}
              >
                Tidak, batal
              </button>

              <button
                className="flex-1 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                disabled={saving}
                onClick={handleApprove}
              >
                {saving ? "Memproses..." : "Ya, konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== POPUP REJECT ===================== */}
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
                className="flex-1 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                disabled={saving}
                onClick={handleReject}
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
