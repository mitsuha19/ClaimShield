import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";
import { useAuth } from "../auth/AuthContext";

export default function Add() {
  const { addPengajuan } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [poli, setPoli] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [token, setToken] = useState("");
  const [peserta, setPeserta] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form fields tambahan (supaya bisa dikirim ke BE dashboard)
  const [jenisLayanan, setJenisLayanan] = useState("");
  const [dokter, setDokter] = useState("");
  const [tanggalPelayanan, setTanggalPelayanan] = useState("");
  const [diagnosaUtama, setDiagnosaUtama] = useState("");
  const [diagnosaTambahan, setDiagnosaTambahan] = useState("");
  const [resumeKeluhan, setResumeKeluhan] = useState("");
  const [terapiObat, setTerapiObat] = useState("");

  // TODO: pindahkan ke .env di kemudian hari
  const DASHBOARD_API_BASE = "http://localhost:3000/api";
  const BC_API_BASE = "http://localhost:4000/api";

  const dummyTokenDB = {
    "ASDP-as201XoYS7": {
      pesertaID: "P-002",
      nama: "Jonathan Siregar",
      nik: "1234567890123456",
      kelas: "Kelas 3",
      fktp: "FKTP-01012",
      eligibility: "Eligible - Rawat Jalan",

      riwayat: [
        {
          fasilitas: "Klinik Sehat",
          tanggal: "2025-01-12",
          diagnosa: "Infeksi saluran pernapasan atas (ISPA)",
          keluhan: "Demam, batuk berdahak, badan lemas selama 3 hari",
          terapi: "Paracetamol 500mg, Mukolitik, Vitamin C",
        },
        {
          fasilitas: "Puskesmas Martubung",
          tanggal: "2024-11-22",
          diagnosa: "Alergi kulit",
          keluhan: "Ruam merah pada lengan dan leher",
          terapi: "CTM 4mg, Hydrocortisone salep",
        },
      ],

      rekam_medis: [
        {
          fasilitas: "Klinik Sehat",
          tanggal: "2024-07-14",
          tindakan: "Pemeriksaan fisik lengkap",
          hasil: "Tekanan darah tinggi, disarankan kontrol rutin",
          catatan: "Pasien mengalami stres kerja tinggi",
        },
        {
          fasilitas: "Rumah Sakit Murni Teguh",
          tanggal: "2023-10-02",
          tindakan: "Rontgen Dada",
          hasil: "Tidak ditemukan kelainan",
          catatan: "Disarankan evaluasi tahunan",
        },
      ],
    },
  };

  function handleSubmitToken() {
    const data = dummyTokenDB[token];
    if (!data) {
      alert("Token tidak valid atau tidak ditemukan.");
      return;
    }
    setPeserta(data);
    setShowPopup(false);
  }

  async function handleSubmit() {
    if (!peserta) {
      alert("Harap scan atau masukkan token peserta terlebih dahulu.");
      return;
    }

    // Validasi minimal untuk form layanan
    if (!poli || !tanggalPelayanan || !diagnosaUtama) {
      alert("Poli, Tanggal Pelayanan, dan Diagnosa Utama wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      // 1) Generate ID klaim (untuk claim_code & ID di Blockchain)
      const claimCode = "KLAIM-" + Date.now(); // Prototype: unik & mudah
      const layananText =
        jenisLayanan || `Layanan Poli ${poli || "Tidak Diketahui"}`;
      const timestamp = new Date().toISOString(); // Untuk BC
      const biayaNumber = 0; // sementara 0 dulu, nanti bisa ditambah input biaya

      // 2) Simpan ke DB via BE dashboard (port 3000)
      const dashboardBody = {
        claim_code: claimCode,
        peserta_id: peserta.pesertaID, // dari token dummy
        fktp_id: user?.username || "FKTP-UNKNOWN", // asumsi username = ID FKTp
        jenis_layanan: jenisLayanan,
        poli,
        dokter_penanggung_jawab: dokter,
        tanggal_pelayanan: tanggalPelayanan,
        sep_document_url: null, // TODO: isi kalau sudah ada upload SEP
        diagnosa_utama: diagnosaUtama,
        diagnosa_tambahan: diagnosaTambahan,
        resume_keluhan: resumeKeluhan,
        terapi_obat: terapiObat,
        biaya: biayaNumber,
      };

      const resDashboard = await fetch(`${DASHBOARD_API_BASE}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dashboardBody),
      });

      if (!resDashboard.ok) {
        const text = await resDashboard.text();
        throw new Error(
          `Gagal simpan klaim ke dashboard: ${resDashboard.status} ${text}`
        );
      }

      const dashboardJson = await resDashboard.json();
      const claimDb = dashboardJson?.data;
      const claimDbId = claimDb?.id;

      console.log("✅ Klaim tersimpan di DB:", claimDb);

      // 3) Create claim di Blockchain via BE BC (port 4000)
      const bcCreateBody = {
        id: claimCode, // ID klaim di blockchain
        pesertaID: peserta.pesertaID,
        fktpID: user?.username || "FKTP-UNKNOWN",
        layanan: layananText,
        biaya: biayaNumber,
        timestamp,
      };

      const resBcCreate = await fetch(`${BC_API_BASE}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bcCreateBody),
      });

      if (!resBcCreate.ok) {
        const text = await resBcCreate.text();
        throw new Error(
          `Gagal create klaim di Blockchain: ${resBcCreate.status} ${text}`
        );
      }

      const bcCreateJson = await resBcCreate.json();
      console.log("✅ Klaim tercatat di Blockchain:", bcCreateJson);

      // 4) Langsung panggil Validate di Blockchain
      const resBcValidate = await fetch(
        `${BC_API_BASE}/claims/${encodeURIComponent(claimCode)}/validate`,
        {
          method: "POST",
        }
      );

      if (!resBcValidate.ok) {
        const text = await resBcValidate.text();
        console.warn(
          `⚠️ Gagal mem-validasi klaim di Blockchain: ${resBcValidate.status} ${text}`
        );
      } else {
        console.log("✅ Klaim tervalidasi di Blockchain");
      }

      // 5) (Opsional tapi enak) Update status di DB jadi "validate"
      if (claimDbId) {
        try {
          const resUpdateStatus = await fetch(
            `${DASHBOARD_API_BASE}/claims/${claimDbId}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "validate" }),
            }
          );

          if (!resUpdateStatus.ok) {
            const text = await resUpdateStatus.text();
            console.warn(
              `⚠️ Gagal update status klaim di DB: ${resUpdateStatus.status} ${text}`
            );
          } else {
            console.log("✅ Status klaim di DB di-update ke 'validate'");
          }
        } catch (err) {
          console.warn("⚠️ Error saat update status DB:", err);
        }
      }

      addPengajuan({
        id: claimDbId?.toString() || claimCode,
        claimCode,
        pesertaID: peserta.pesertaID,
        nama: peserta.nama,
        fktpID: user?.username || "FKTP-UNKNOWN",
        layanan: layananText,
        timestamp,
        riwayat: peserta.riwayat,
        rekam_medis: peserta.rekam_medis,
      });

      alert("Klaim berhasil diajukan dan dikirim ke Blockchain 🚀");
      navigate("/dashboard-fktp");
    } catch (err) {
      console.error("❌ Error saat mengajukan klaim:", err);
      alert("Terjadi kesalahan saat mengajukan klaim: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[360px]">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Pilih Metode Input
            </h2>

            <button
              className="w-full bg-teal-600 text-white py-2 rounded-md mb-4"
              onClick={() => alert("Scanner kamera belum diaktifkan.")}
            >
              Scan Barcode
            </button>

            <input
              type="text"
              placeholder="Masukkan Token Barcode"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="border w-full p-2 rounded mb-3"
            />

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md"
              onClick={handleSubmitToken}
            >
              Submit Token
            </button>

            <button
              className="w-full mt-3 text-gray-600"
              onClick={() => setShowPopup(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-teal-700 mb-6">
        Tambah Pengajuan
      </h1>

      {/* Data Peserta */}
      <div className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        {!peserta && (
          <>
            <div
              className="flex justify-center items-center py-10 cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              <img src="/qr.png" alt="Scan QR" className="h-40 opacity-70" />
            </div>

            <p className="text-center text-gray-500 text-sm">
              Tekan untuk memindai data peserta
            </p>
          </>
        )}

        {peserta && (
          <div className="mt-4 space-y-1 text-sm">
            <div>
              <b>PESERTA ID:</b> {peserta.pesertaID}
            </div>
            <div>
              <b>NAMA:</b> {peserta.nama}
            </div>
            <div>
              <b>NIK:</b> {peserta.nik}
            </div>
            <div>
              <b>KELAS:</b> {peserta.kelas}
            </div>
            <div>
              <b>FKTP TERDAFTAR:</b> {peserta.fktp}
            </div>
            <div>
              <b>ELIGIBILITY:</b> {peserta.eligibility}
            </div>
          </div>
        )}
      </div>

      {/* Riwayat Layanan */}
      {peserta && peserta.riwayat && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
            {peserta.riwayat.map((r, index) => (
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

      {/* Riwayat Rekam Medis */}
      {peserta && peserta.rekam_medis && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
            {peserta.rekam_medis.map((r, index) => (
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

      {/* Form Layanan & Diagnosa */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Informasi Layanan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={jenisLayanan}
                onChange={(e) => setJenisLayanan(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={poli}
                onChange={(e) => setPoli(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dokter Penanggung Jawab
              </label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={dokter}
                onChange={(e) => setDokter(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={tanggalPelayanan}
                onChange={(e) => setTanggalPelayanan(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">
                Surat Eligibilitas Peserta
              </label>
              <input
                type="file"
                className="mt-1 block w-full text-sm text-gray-700
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:bg-teal-600 file:text-white
                hover:file:bg-teal-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Diagnosa & Tindakan */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa dan Tindakan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Diagnosa Utama (ICD-10)
              </label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={diagnosaUtama}
                onChange={(e) => setDiagnosaUtama(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={diagnosaTambahan}
                onChange={(e) => setDiagnosaTambahan(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea
                className="w-full border rounded p-2 h-20"
                value={resumeKeluhan}
                onChange={(e) => setResumeKeluhan(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea
                className="w-full border rounded p-2 h-20"
                value={terapiObat}
                onChange={(e) => setTerapiObat(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Mengirim..." : "Tambah"}
        </button>
      </div>
    </div>
  );
}
