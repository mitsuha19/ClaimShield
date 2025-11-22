export const bpjsDummy = [
  {
    id: "KLAIM-001",
    pesertaID: "KLAIM-001",
    nama: "Jonathan Siregar",
    nik: "1234567890123456",
    kelas: "Kelas 3",
    fktp: "FKTP-01012",
    eligibility: "Eligible - Rawat Jalan",
    layanan: "J06.9 – Infeksi Saluran Pernapasan Atas",
    timestamp: "2025-11-22",
    status: "Menunggu",
    alasan: null,

    informasi_layanan: {
      jenis_layanan: "Rawat Jalan - Pemeriksaan Umum",
      poli: "Poli Umum",
      dokter: "dr. Anggun Pratiwi",
      tanggal_pelayanan: "2025-01-24",
    },

    diagnosa_tindakan: {
      diagnosa_utama: "K30 - Dyspepsia (Gangguan Pencernaan)",
      diagnosa_tambahan: "R10.1 - Nyeri Perut Bagian Atas",
      resume: "nyeri perut sejak 3 hari lalu, pilek, tidak demam.",
      terapi:
        " OMEPRAZOLE 20 MG CAPS - 2x1 (Sebelum Makan), ANTASIDA DOEN TAB -3x1 (Kunyah), DOMPERIDONE 10 MG - 3x1 (Jika Mual)",
    },

    riwayat: [
      {
        fasilitas: "Klinik Sehat",
        tanggal: "2025-01-12",
        diagnosa: "Infeksi saluran pernapasan atas (ISPA)",
        keluhan: "Demam, batuk berdahak, badan lemas",
        terapi: "Paracetamol 500mg, Mukolitik",
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
        hasil: "Tekanan darah tinggi",
        catatan: "Pasien mengalami stres kerja",
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

  {
    id: "KLAIM-002",
    pesertaID: "PST-9002",
    nama: "Lana Bakkery",
    layanan: "J06.9 - Infeksi Saluran Pernapasan Atas",
    timestamp: "2025-01-22",
    status: "Menunggu",
    alasan: null,
  },
  {
    id: "KLAIM-003",
    pesertaID: "PST-9003",
    nama: "Jakob Sipae",
    layanan: "A09 - Diare Akut",
    timestamp: "2025-01-21",
    status: "Menunggu",
    alasan: null,
  },
  {
    id: "KLAIM-004",
    pesertaID: "PST-9004",
    nama: "Timoty Ronald",
    layanan: "I10 - Hipertensi Esensial",
    timestamp: "2025-01-20",
    status: "Diterima",
    alasan: null,
  },
  {
    id: "KLAIM-005",
    pesertaID: "PST-9005",
    nama: "Martha Limbong",
    layanan: "R05 - Batuk",
    timestamp: "2025-01-18",
    status: "Diterima",
    alasan: null,
  },
];
