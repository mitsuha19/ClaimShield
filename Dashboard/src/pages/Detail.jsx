import { useSearchParams } from "react-router-dom";
import { useData } from "../auth/DataContext";

export default function Detail() {
  const { pengajuan } = useData();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const current = pengajuan.find((item) => item.id === id) || null;

  if (!current) {
    return (
      <div className="p-6 max-h-screen">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">Detail Pengajuan</h1>
        <p>Data pengajuan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-screen">
      {/* ===== Title ===== */}
      <h1 className="text-2xl font-bold text-teal-700 mb-1">Detail Pengajuan</h1>
      <p className="text-sm text-gray-600 mb-6">
        ID Klaim: <span className="font-semibold">{current.id}</span> · Peserta ID:{" "}
        <span className="font-semibold">{current.pesertaID}</span> · FKTP:{" "}
        <span className="font-semibold">{current.fktpID}</span> · Tanggal:{" "}
        <span className="font-semibold">{current.timestamp}</span>
      </p>

      {/* ===== Data Peserta ===== */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div className="flex"><p className="w-48 font-medium">Peserta ID</p><p className="mr-2">:</p><p>{current.pesertaID}</p></div>
          <div className="flex"><p className="w-48 font-medium">FKTP ID</p><p className="mr-2">:</p><p>{current.fktpID}</p></div>
          <div className="flex"><p className="w-48 font-medium">Tanggal</p><p className="mr-2">:</p><p>{current.timestamp}</p></div>
          <div className="flex"><p className="w-48 font-medium">Status Kepesertaan</p><p className="mr-2">:</p><p>Aktif</p></div>
          <div className="flex"><p className="w-48 font-medium">Kelas Perawatan</p><p className="mr-2">:</p><p>Kelas 3</p></div>
          <div className="flex"><p className="w-48 font-medium">Eligibility Layanan</p><p className="mr-2">:</p><p>Eligible (Rawat Jalan)</p></div>
        </div>
      </div>

      {/* ===== Riwayat ===== (dummy) */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <p className="font-semibold mb-3">Riwayat Layanan :</p>

        <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
          {/* Dummy riwayat tetap sama seperti punyamu */}
          <div className="border-b pb-3">
            <p className="font-medium">Klinik Sehat (12-04-2025)</p>
            <p className="font-semibold mt-2">Diagnosa Pelayanan</p>
            <p>Infeksi saluran pernapasan atas (ISPA) non spesifik.</p>
            <p className="font-bold mt-2">Keluhan</p>
            <p>Batuk berdahak, pilek, tenggorokan sakit sejak 3 hari.</p>
            <p className="font-bold mt-2">Terapi Obat</p>
            <p>Paracetamol 500mg, CTM 4mg, Sirup ambroxol.</p>
          </div>

          {/* dst, dibiarkan sama */}
        </div>
      </div>

      {/* ===== Layanan + Diagnosa + Status ===== */}
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-6 mb-6">
        {/* Informasi Layanan */}
        <div className="bg-white shadow rounded-lg p-5 col-span-1">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                value={current.layanan}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                value={current.layanan}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dokter Penanggung Jawab</label>
              <input
                type="text"
                value="dr. Anggun Pratiwi"
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input
                type="date"
                defaultValue={current.timestamp}
                className="w-full border rounded p-2 bg-gray-100"
                disabled
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Surat Eligibilitas Peserta</label>
              <input
                type="file"
                disabled
                className="
                  mt-1 block w-full text-sm text-gray-500
                  cursor-not-allowed opacity-70
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:bg-gray-300 file:text-gray-600
                  file:cursor-not-allowed
                "
              />
            </div>
          </div>
        </div>

        {/* Diagnosa (dummy tetap) */}
        <div className="bg-white shadow rounded-lg p-5 col-span-1">
          <h2 className="text-lg font-semibold mb-4">Diagnosa & Tindakan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Diagnosa Utama (ICD-10)</label>
              <input type="text" value="J06.9" className="w-full border rounded p-2 bg-gray-100" disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input type="text" value="R05 - Batuk" className="w-full border rounded p-2 bg-gray-100" disabled />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Resume / Keluhan</label>
              <textarea
                className="w-full border rounded p-2 h-20 bg-gray-100"
                disabled
              >
                Batuk sejak 3 hari lalu, pilek, tidak demam.
              </textarea>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Terapi Obat</label>
              <textarea
                className="w-full border rounded p-2 h-20 bg-gray-100"
                disabled
              >
                Paracetamol, CTM, Sirup batuk
              </textarea>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white shadow rounded-lg p-5 col-span-1">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="p-3 rounded bg-gray-100 text-center font-semibold text-teal-600">
            Menunggu
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700">
          Selesai
        </button>
      </div>
    </div>
  );
}
