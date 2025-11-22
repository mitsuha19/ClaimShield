import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { bpjsDummy } from "../utils/bpjsDummy"; // Asumsi path ke dummy data, sesuaikan jika perlu

export default function DetailBpjs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [current, setCurrent] = useState(null); // State untuk data detail
  const [list, setList] = useState([]); // Load full list untuk update
  const [isLoading, setIsLoading] = useState(false); // Loading untuk API call

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Load data dari localStorage (atau sessionStorage jika mau temporary/hilang saat reload)
  const loadData = () => {
    const stored = localStorage.getItem("bpjs-data"); // Ganti ke sessionStorage.getItem jika temporary
    const data = stored ? JSON.parse(stored) : bpjsDummy; // Fallback ke dummy jika belum ada
    setList(data);
    const found = data.find((item) => item.id === id);
    setCurrent(found || null);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Fungsi untuk call API approve dengan Axios
  const callApproveAPI = async (claimId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/claims/${claimId}/approve`,
        {
          approvedBy: "Dr. Tirta",
          status: "Approved",
          userToken:
            "deI1J6AqT_qTCabHZwFrrk:APA91bH3Zbz6Huzrsj7HyDzUqlZ_p_2tN8qE3xv4-b9jEJBXlmcuJ-JH7yeQEVvKAhmJyuhskjdHnMw159cwZkpWq4OkhX-haB5KNZVJh98ef3lk5UmRR30",
        }
      );

      console.log("API Approve success:", response.data); // Log hasil untuk debug
      return true;
    } catch (error) {
      console.error(
        "API Approve failed:",
        error.response?.data || error.message
      );
      alert("Gagal memanggil API approve. Cek console untuk detail."); // Atau handle lebih baik (e.g., toast)
      return false;
    }
  };

  // Fungsi update status (manual, update localStorage + API untuk approve)
  // Hanya untuk KLAIM-001 seperti permintaan, tapi bisa dihapus batasan jika perlu
  const updateStatus = async (targetId, newStatus, alasan = null) => {
    if (targetId !== "KLAIM-001") {
      console.warn("Update hanya untuk KLAIM-001 (demo mode)");
      return;
    }

    const updatedList = list.map((item) =>
      item.id === targetId
        ? { ...item, status: newStatus, alasan: alasan }
        : item
    );

    localStorage.setItem("bpjs-data", JSON.stringify(updatedList)); // Ganti ke sessionStorage jika temporary
    setList(updatedList); // Update state untuk konsistensi

    // Update current juga
    setCurrent((prev) =>
      prev ? { ...prev, status: newStatus, alasan: alasan } : null
    );

    // Jika approve, call API
    if (newStatus === "Diterima") {
      const apiSuccess = await callApproveAPI(targetId);
      if (!apiSuccess) {
        // Optional: Rollback jika API gagal, tapi untuk simple, kita lanjut aja
        console.warn("API gagal, tapi local update tetap jalan.");
      }
    }
  };

  if (!current) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Detail Pengajuan
        </h1>
        <p>Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-hidden ">
      <h1 className="text-2xl font-bold text-teal-700 mb-1">
        Detail Pengajuan
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        ID Klaim: <b>{current.id}</b> · Peserta ID: <b>{current.pesertaID}</b> ·
        FKTP: <b>{current.fktp}</b> · Tanggal: <b>{current.timestamp}</b>
      </p>

      {/* ===================== DATA PESERTA ===================== */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div>
            <b>Nama:</b> {current.nama}
          </div>
          <div>
            <b>NIK:</b> {current.nik}
          </div>
          <div>
            <b>Kelas Rawat:</b> {current.kelas}
          </div>
          <div>
            <b>Eligibility:</b> {current.eligibility}
          </div>
          <div>
            <b>Status:</b> {current.status || "Menunggu"}
          </div>

          {current.alasan && (
            <div className="text-red-600">
              <b>Alasan Penolakan:</b> {current.alasan}
            </div>
          )}
        </div>
      </div>

      {/* ===================== RIWAYAT LAYANAN ===================== */}
      {current.riwayat && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {current.riwayat.map((r, idx) => (
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

      {/* ===================== REKAM MEDIS ===================== */}
      {current.rekam_medis && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {current.rekam_medis.map((r, idx) => (
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
              <label>Jenis Layanan</label>
              <input
                disabled
                value={current.informasi_layanan?.jenis_layanan || ""}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label>Poli</label>
              <input
                disabled
                value={current.informasi_layanan?.poli || ""}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label>Dokter</label>
              <input
                disabled
                value={current.informasi_layanan?.dokter || ""}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label>Tanggal Pelayanan</label>
              <input
                disabled
                value={current.informasi_layanan?.tanggal_pelayanan || ""}
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
              <label>Diagnosa Utama</label>
              <input
                disabled
                value={current.diagnosa_tindakan?.diagnosa_utama || ""}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
            <div>
              <label>Diagnosa Tambahan</label>
              <input
                disabled
                value={current.diagnosa_tindakan?.diagnosa_tambahan || ""}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>

            <div className="col-span-2">
              <label>Resume</label>
              <textarea
                disabled
                className="w-full border rounded p-2 bg-gray-100 h-20"
              >
                {current.diagnosa_tindakan?.resume}
              </textarea>
            </div>

            <div className="col-span-2">
              <label>Terapi Obat</label>
              <textarea
                disabled
                className="w-full border rounded p-2 bg-gray-100 h-20"
              >
                {current.diagnosa_tindakan?.terapi}
              </textarea>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div
            className={`p-3 rounded text-center font-semibold ${
              current.status === "Diterima"
                ? "bg-green-100 text-green-700"
                : current.status === "Ditolak"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-teal-600"
            }`}
          >
            {current.status}
          </div>

          {current.alasan && (
            <p className="text-red-600 mt-2 text-sm">
              <b>Alasan:</b> {current.alasan}
            </p>
          )}
        </div>
      </div>

      {/* ===================== TOMBOL AKSI ===================== */}
      {current.status === "Menunggu" && (
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
              Menerima Pengajuan akan permanen dan tidak bisa dibatalkan.
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
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  await updateStatus(current.id, "Diterima");
                  setIsLoading(false);
                  setShowApprove(false);
                  navigate("/dashboard-bpjs");
                }}
              >
                {isLoading ? "Memproses..." : "Ya, konfirmasi"}
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
              placeholder="Layanan Pasien tidak sesuai dengan keluhan pasien"
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
                  if (!rejectReason.trim()) {
                    alert("Alasan wajib diisi.");
                    return;
                  }
                  updateStatus(current.id, "Ditolak", rejectReason);
                  setShowReject(false);
                  navigate("/dashboard-bpjs");
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
