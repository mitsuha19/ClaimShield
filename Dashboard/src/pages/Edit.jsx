import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";

export default function Edit() {
  const { pengajuan, editPengajuan } = useData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const current = pengajuan.find((item) => item.id === id) || null;

  const [layanan, setLayanan] = useState("");

  useEffect(() => {
    if (current) {
      setLayanan(current.layanan || "");
    }
  }, [current]);

  function handleSave() {
    if (!current) return;

    editPengajuan(current.id, {
      ...current,
      layanan,
    });

    navigate("/dashboard-fktp");
  }

  if (!current) {
    return (
      <div className="p-6 max-h-screen">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">Edit Pengajuan</h1>
        <p>Data pengajuan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-screen ">
      {/* ===== Title ===== */}
      <h1 className="text-2xl font-bold text-teal-700 mb-6">Edit Pengajuan</h1>

      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div className="flex"><p className="w-48 font-medium">ID Klaim</p><p className="mr-2">:</p><p>{current.id}</p></div>
          <div className="flex"><p className="w-48 font-medium">Peserta ID</p><p className="mr-2">:</p><p>{current.pesertaID}</p></div>
          <div className="flex"><p className="w-48 font-medium">FKTP ID</p><p className="mr-2">:</p><p>{current.fktpID}</p></div>
          <div className="flex"><p className="w-48 font-medium">Tanggal</p><p className="mr-2">:</p><p>{current.timestamp}</p></div>
        </div>
      </div>

      {/* ===== Riwayat Layanan (dummy tetap) ===== */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <p className="font-semibold mb-3">Riwayat Layanan :</p>

        <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
          {/* dummy seperti sebelumnya */}
          <div className="border-b pb-3">
            <p className="font-medium">Klinik Sehat (12-04-2025)</p>
            <p className="font-semibold mt-2">Diagnosa Pelayanan</p>
            <p>Infeksi saluran pernapasan atas (ISPA) non spesifik.</p>
            <p className="font-bold mt-2">Keluhan</p>
            <p>Batuk berdahak, pilek, tenggorokan sakit sejak 3 hari.</p>
            <p className="font-bold mt-2">Terapi Obat</p>
            <p>Paracetamol 500mg, CTM 4mg, Sirup ambroxol.</p>
          </div>

          {/* dll, dibiarkan sama persis dengan kodenmu */}
        </div>
      </div>

      {/* ===== Layanan + Diagnosa ===== */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                value={current.layanan}
                onChange={(e) => setLayanan(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                value={layanan}
                onChange={(e) => setLayanan(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dokter Penanggung Jawab</label>
              <input type="text" value="dr. Anggun Pratiwi" className="w-full border rounded p-2" readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input type="date" defaultValue="2025-01-24" className="w-full border rounded p-2" />
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

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Diagnosa & Tindakan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Diagnosa Utama (ICD-10)</label>
              <input type="text" value="J06.9" className="w-full border rounded p-2" readOnly />
            </div>
            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input type="text" value="R05 - Batuk" className="w-full border rounded p-2" readOnly />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea className="w-full border rounded p-2 h-20">Batuk sejak 3 hari lalu, pilek, tidak demam.</textarea>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea className="w-full border rounded p-2 h-20">Paracetamol, CTM, Sirup batuk</textarea>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
