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

  const dummyTokenDB = {
    "ASDP-as201XoYS7": {
      pesertaID: "KLAIM-001",
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
          terapi: "Paracetamol 500mg, Mukolitik, Vitamin C"
        },
        {
          fasilitas: "Puskesmas Martubung",
          tanggal: "2024-11-22",
          diagnosa: "Alergi kulit",
          keluhan: "Ruam merah pada lengan dan leher",
          terapi: "CTM 4mg, Hydrocortisone salep"
        }
      ],

      rekam_medis: [
        {
          fasilitas: "Klinik Sehat",
          tanggal: "2024-07-14",
          tindakan: "Pemeriksaan fisik lengkap",
          hasil: "Tekanan darah tinggi, disarankan kontrol rutin",
          catatan: "Pasien mengalami stres kerja tinggi"
        },
        {
          fasilitas: "Rumah Sakit Murni Teguh",
          tanggal: "2023-10-02",
          tindakan: "Rontgen Dada",
          hasil: "Tidak ditemukan kelainan",
          catatan: "Disarankan evaluasi tahunan"
        }
      ]
    }
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

  function handleSubmit() {
    if (!peserta) {
      alert("Harap scan atau masukkan token peserta terlebih dahulu.");
      return;
    }

    const id = "KLAIM-" + Date.now();
    const timestamp = new Date().toISOString().split("T")[0];

    addPengajuan({
      id,
      pesertaID: peserta.pesertaID,
      nama: peserta.nama,
      fktpID: user?.username || "FKTP-UNKNOWN",
      layanan: poli || "Layanan Tidak Diketahui",
      timestamp,
      riwayat: peserta.riwayat,
      rekam_medis: peserta.rekam_medis
    });

    navigate("/dashboard-fktp");
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

      <div className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        {!peserta && (
          <>
            <div
              className="flex justify-center items-center py-10 cursor-pointer"
              onClick={() => setShowPopup(true)}
            >
              <img
                src="/qr.png"
                alt="Scan QR"
                className="h-40 opacity-70"
              />
            </div>

            <p className="text-center text-gray-500 text-sm">
              Tekan untuk memindai data peserta
            </p>
          </>
        )}

        {peserta && (
          <div className="mt-4 space-y-1 text-sm">
            <div><b>PESERTA ID:</b> {peserta.pesertaID}</div>
            <div><b>NAMA:</b> {peserta.nama}</div>
            <div><b>NIK:</b> {peserta.nik}</div>
            <div><b>KELAS:</b> {peserta.kelas}</div>
            <div><b>FKTP TERDAFTAR:</b> {peserta.fktp}</div>
            <div><b>ELIGIBILITY:</b> {peserta.eligibility}</div>
          </div>
        )}
      </div>

      {peserta && peserta.riwayat && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
            {peserta.riwayat.map((r, index) => (
              <div key={index} className="border-b pb-3">

                <p className="font-medium">{r.fasilitas} ({r.tanggal})</p>

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

      {peserta && peserta.rekam_medis && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
            {peserta.rekam_medis.map((r, index) => (
              <div key={index} className="border-b pb-3">

                <p className="font-medium">{r.fasilitas} ({r.tanggal})</p>

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

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input type="text" className="w-full border rounded p-2" />
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
              <label className="text-sm font-medium">Dokter Penanggung Jawab</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input type="date" className="w-full border rounded p-2" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Surat Eligibilitas Peserta</label>
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

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa dan Tindakan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Diagnosa Utama (ICD-10)</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea className="w-full border rounded p-2 h-20" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea className="w-full border rounded p-2 h-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Tambah
        </button>
      </div>
    </div>
  );
}
