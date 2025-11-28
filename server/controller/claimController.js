// controllers/claimController.js
const Claim = require("../model/Claim");

/**
 * POST /api/claims
 * Simpan pengajuan klaim baru dari dashboard
 */
exports.createClaim = async (req, res) => {
  try {
    const {
      claim_code,
      peserta_id,
      fktp_id,
      jenis_layanan,
      poli,
      dokter_penanggung_jawab,
      tanggal_pelayanan,
      sep_document_url,
      diagnosa_utama,
      diagnosa_tambahan,
      resume_keluhan,
      terapi_obat,
      biaya,
      status, // optional, default "pending" kalau tidak dikirim
    } = req.body;

    // Validasi minimal field wajib
    if (
      !claim_code ||
      !peserta_id ||
      !fktp_id ||
      !poli ||
      !tanggal_pelayanan ||
      !diagnosa_utama
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Field claim_code, peserta_id, fktp_id, poli, tanggal_pelayanan, dan diagnosa_utama wajib diisi",
      });
    }

    const newClaim = await Claim.create({
      claim_code,
      peserta_id,
      fktp_id,
      jenis_layanan,
      poli,
      dokter_penanggung_jawab,
      tanggal_pelayanan,
      sep_document_url,
      diagnosa_utama,
      diagnosa_tambahan,
      resume_keluhan,
      terapi_obat,
      biaya,
      status, // kalau undefined → pakai default enum "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Claim berhasil dibuat",
      data: newClaim,
    });
  } catch (err) {
    console.error("Error createClaim:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat claim",
      error: err.message,
    });
  }
};

/**
 * GET /api/claims
 * List semua klaim (bisa ditambah filter ?status=pending)
 */
exports.getAllClaims = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const claims = await Claim.findAll({
      where,
      // pakai nama field model (createdAt), walaupun di DB kolomnya created_at karena underscored: true
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      data: claims,
    });
  } catch (err) {
    console.error("Error getAllClaims:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar claim",
      error: err.message,
    });
  }
};

/**
 * GET /api/claims/:id
 * Detail klaim berdasarkan primary key `id`
 */
exports.getClaimById = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findByPk(id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: claim,
    });
  } catch (err) {
    console.error("Error getClaimById:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail claim",
      error: err.message,
    });
  }
};

/**
 * PUT /api/claims/:id
 * Update full data klaim
 */
exports.updateClaim = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findByPk(id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim tidak ditemukan",
      });
    }

    const {
      claim_code,
      peserta_id,
      fktp_id,
      jenis_layanan,
      poli,
      dokter_penanggung_jawab,
      tanggal_pelayanan,
      sep_document_url,
      diagnosa_utama,
      diagnosa_tambahan,
      resume_keluhan,
      terapi_obat,
      biaya,
      status,
      blockchain_tx_id,
    } = req.body;

    await claim.update({
      claim_code,
      peserta_id,
      fktp_id,
      jenis_layanan,
      poli,
      dokter_penanggung_jawab,
      tanggal_pelayanan,
      sep_document_url,
      diagnosa_utama,
      diagnosa_tambahan,
      resume_keluhan,
      terapi_obat,
      biaya,
      status,
      blockchain_tx_id,
    });

    return res.json({
      success: true,
      message: "Claim berhasil diupdate",
      data: claim,
    });
  } catch (err) {
    console.error("Error updateClaim:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengupdate claim",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/claims/:id/status
 * Update hanya status klaim (misal dari pending → validate → approve/rejected)
 */
exports.updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, blockchain_tx_id } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Field status wajib diisi",
      });
    }

    const claim = await Claim.findByPk(id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim tidak ditemukan",
      });
    }

    await claim.update({
      status,
      blockchain_tx_id: blockchain_tx_id ?? claim.blockchain_tx_id,
    });

    return res.json({
      success: true,
      message: "Status claim berhasil diupdate",
      data: claim,
    });
  } catch (err) {
    console.error("Error updateClaimStatus:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengupdate status claim",
      error: err.message,
    });
  }
};

/**
 * DELETE /api/claims/:id
 * Hapus klaim (hard delete)
 */
exports.deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;

    const claim = await Claim.findByPk(id);
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim tidak ditemukan",
      });
    }

    await claim.destroy();

    return res.json({
      success: true,
      message: "Claim berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteClaim:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus claim",
      error: err.message,
    });
  }
};
