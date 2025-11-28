import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useData } from "../auth/DataContext";

const DASHBOARD_API_BASE = "http://localhost:3000/api";
const BC_API_BASE = "http://localhost:4000/api";

export default function Edit() {
  const { pengajuan, editPengajuan } = useData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======== FORM STATE ========
  const [layanan, setLayanan] = useState("");
  const [poli, setPoli] = useState("");
  const [dokter, setDokter] = useState("");
  const [tanggalPelayanan, setTanggalPelayanan] = useState("");

  const [diagnosaUtama, setDiagnosaUtama] = useState("");
  const [diagnosaTambahan, setDiagnosaTambahan] = useState("");
  const [resumeKeluhan, setResumeKeluhan] = useState("");
  const [terapiObat, setTerapiObat] = useState("");

  // data lokal untuk riwayat & rekam medis
  const local = pengajuan.find(
    (item) =>
      item.id?.toString() === id?.toString() ||
      (claim && item.claimCode === claim.claim_code)
  );

  // ======== FETCH DETAIL KLAIM DARI DB ========
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
        const data = json.data;
        setClaim(data);
        setError("");

        // Prefill form dari data DB
        setLayanan(data.jenis_layanan || "");
        setPoli(data.poli || "");
        setDokter(data.dokter_penanggung_jawab || "");
        setTanggalPelayanan(data.tanggal_pelayanan || "");

        setDiagnosaUtama(data.diagnosa_utama || "");
        setDiagnosaTambahan(data.diagnosa_tambahan || "");
        setResumeKeluhan(data.resume_keluhan || "");
        setTerapiObat(data.terapi_obat || "");
      } catch (err) {
        console.error("Error fetch claim detail (edit):", err);
        setError(err.message || "Gagal memuat data klaim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  // ======== HANDLE SAVE ========
  async function handleSave() {
    if (!claim) return;

    if (!layanan || !poli || !dokter || !tanggalPelayanan) {
      alert(
        "Jenis layanan, poli, dokter penanggung jawab, dan tanggal pelayanan wajib diisi."
      );
      return;
    }

    setSaving(true);

    try {
      // 1) Update klaim di DB (PUT /claims/:id)
      const body = {
        claim_code: claim.claim_code,
        peserta_id: claim.peserta_id,
        fktp_id: claim.fktp_id,
        jenis_layanan: layanan,
        poli,
        dokter_penanggung_jawab: dokter,
        tanggal_pelayanan: tanggalPelayanan,
        sep_document_url: claim.sep_document_url,
        diagnosa_utama: diagnosaUtama,
        diagnosa_tambahan: diagnosaTambahan,
        resume_keluhan: resumeKeluhan,
        terapi_obat: terapiObat,
        biaya: claim.biaya,
        status: claim.status,
        blockchain_tx_id: claim.blockchain_tx_id,
      };

      const resUpdate = await fetch(`${DASHBOARD_API_BASE}/claims/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resUpdate.ok) {
        const text = await resUpdate.text();
        throw new Error(
          `Gagal update klaim di dashboard: ${resUpdate.status} ${text || ""}`
        );
      }

      const updatedJson = await resUpdate.json();
      const updatedClaim = updatedJson.data;
      setClaim(updatedClaim);

      // 2) Validate ulang ke Blockchain
      if (updatedClaim?.claim_code) {
        const resBcValidate = await fetch(
          `${BC_API_BASE}/claims/${encodeURIComponent(
            updatedClaim.claim_code
          )}/validate`,
          { method: "POST" }
        );

        if (!resBcValidate.ok) {
          const text = await resBcValidate.text();
          console.warn(
            `⚠️ Gagal mem-validasi ulang klaim di Blockchain: ${resBcValidate.status} ${text}`
          );
        } else {
          console.log("✅ Klaim berhasil divalidasi ulang di Blockchain");
        }
      }

      // 3) Update state lokal pengajuan (untuk dashboard)
      if (local) {
        editPengajuan(local.id, {
          ...local,
          layanan,
          poli,
          dokter_penanggung_jawab: dokter,
          tanggal_pelayanan: tanggalPelayanan,
          diagnosa_utama: diagnosaUtama,
          diagnosa_tambahan: diagnosaTambahan,
          resume_keluhan: resumeKeluhan,
          terapi_obat: terapiObat,
        });
      }

      alert("Klaim berhasil diubah dan divalidasi ulang di Blockchain 🚀");
      navigate("/dashboard-fktp");
    } catch (err) {
      console.error("❌ Error saat menyimpan perubahan klaim:", err);
      alert("Terjadi kesalahan saat menyimpan klaim: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // ======== UI STATE: LOADING / ERROR ========
  if (loading) {
    return (
      <div className="p-6 max-h-screen">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Edit Pengajuan
        </h1>
        <p>Memuat data klaim...</p>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="p-6 max-h-screen">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">
          Edit Pengajuan
        </h1>
        <p className="text-red-600 mb-4">
          {error || "Data pengajuan tidak ditemukan."}
        </p>
        <button
          onClick={() => navigate("/dashboard-fktp")}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  // ======== DERIVED DISPLAY DATA ========
  const idKlaim = claim.claim_code || local?.id || "-";
  const pesertaID = claim.peserta_id || local?.pesertaID || "-";
  const fktpID = claim.fktp_id || local?.fktpID || "-";

  const riwayat = local?.riwayat || [];
  const rekamMedis = local?.rekam_medis || [];

  return (
    <div className="p-6 max-h-screen">
      <h1 className="text-2xl font-bold text-teal-700 mb-6">Edit Pengajuan</h1>

      {/* DATA PESERTA */}
      <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data Peserta</h2>

        <div className="space-y-1 text-sm">
          <div className="flex">
            <p className="w-48 font-medium">ID Klaim</p>
            <p className="mr-2">:</p>
            <p>{idKlaim}</p>
          </div>
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
            <p>{tanggalPelayanan || "-"}</p>
          </div>
        </div>
      </div>

      {/* RIWAYAT LAYANAN */}
      {riwayat.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Layanan :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
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

      {/* RIWAYAT REKAM MEDIS */}
      {rekamMedis.length > 0 && (
        <div className="bg-gray-50 shadow rounded-lg p-5 mb-6">
          <p className="font-semibold mb-3">Riwayat Rekam Medis :</p>

          <div className="grid grid-cols-1 gap-4 mt-3 text-sm max-h-48 overflow-y-auto pr-2">
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

      {/* INFORMASI LAYANAN + DIAGNOSA */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* INFORMASI LAYANAN */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-lg font-semibold mb-4">Informasi Layanan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Layanan</label>
              <input
                type="text"
                value={layanan}
                onChange={(e) => setLayanan(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Poli</label>
              <input
                type="text"
                value={poli}
                onChange={(e) => setPoli(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Dokter Penanggung Jawab
              </label>
              <input
                type="text"
                value={dokter}
                onChange={(e) => setDokter(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Pelayanan</label>
              <input
                type="date"
                value={tanggalPelayanan || ""}
                onChange={(e) => setTanggalPelayanan(e.target.value)}
                className="w-full border rounded p-2"
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

        {/* DIAGNOSA & TINDAKAN */}
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
                onChange={(e) => setDiagnosaUtama(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Diagnosa Tambahan</label>
              <input
                type="text"
                value={diagnosaTambahan}
                onChange={(e) => setDiagnosaTambahan(e.target.value)}
                className="w-full border rounded p-2"
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

      {/* TOMBOL SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
