import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";
import { useAuth } from "../auth/AuthContext";

export default function Add() {
  const { addPengajuan } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [poli, setPoli] = useState("");

  function handleSubmit() {
    const id = "KLAIM-" + Date.now();
    const pesertaID = "P-" + Date.now(); // dummy, nanti bisa diganti dari QR
    const fktpID = user?.username || "FKTP-UNKNOWN";
    const layanan = poli || "Layanan Tidak Diketahui";
    const timestamp = new Date().toISOString().split("T")[0];

    addPengajuan({
      id,
      pesertaID,
      fktpID,
      layanan,
      timestamp,
    });

    navigate("/dashboard-fktp");
  }

  return (
    <div className="p-6">
      {/* ===== Title ===== */}
      <h1 className="text-2xl font-bold text-teal-700 mb-6">
        Tambah Pengajuan
      </h1>

      {/* ===== Data Peserta ===== */}
      <div className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="flex justify-center items-center py-10 cursor-pointer">
          <img
            src="/qr.png"
            alt="Scan QR"
            className="h-40 opacity-70"
          />
        </div>

        <p className="text-center text-gray-500 text-sm">
          Tekan untuk memindai data peserta
        </p>
      </div>

      {/* ===== Informasi Layanan + Diagnosa & Tindakan (2 kolom) ===== */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* ===== Informasi Layanan ===== */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded p-2"
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
                className="w-full border border-gray-400 rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input
                type="date"
                className="w-full border border-gray-400 rounded p-2"
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
                  hover:file:bg-teal-700
                  cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ===== Diagnosa & Tindakan ===== */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa & Tindakan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Diagnosa Utama (ICD-10)
              </label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea className="w-full border border-gray-400 rounded p-2 h-20" />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea className="w-full border border-gray-400 rounded p-2 h-20" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tombol Tambah ===== */}
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
