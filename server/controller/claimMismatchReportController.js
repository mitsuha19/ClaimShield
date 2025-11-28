// controllers/claimMismatchReportController.js
const Claim = require("../model/Claim");
const ClaimMismatchReport = require("../model/claimMismatchReport");

/**
 * POST /api/claims/:claimCode/report-not-me
 * Dipanggil dari mobile ketika user lapor "bukan saya yang menerima"
 */
exports.createNotMeReport = async (req, res) => {
  try {
    const { claimCode } = req.params;
    const {
      peserta_id,
      device_token,
      device_info,
      notes,
      requested_action, // JUST_REPORT | BLOCK_CARD | INVESTIGATE (optional)
      message_id, // id notifikasi FCM (optional)
    } = req.body;

    if (!claimCode || !peserta_id) {
      return res.status(400).json({
        success: false,
        message: "claimCode (param) dan peserta_id (body) wajib diisi",
      });
    }

    // Coba cari claim di DB berdasarkan claim_code
    const claim = await Claim.findOne({
      where: { claim_code: claimCode },
    });

    const report = await ClaimMismatchReport.create({
      claim_id: claim ? claim.id : null,
      claim_code: claimCode,
      peserta_id,
      report_type: "NOT_ME",
      device_token: device_token || null,
      device_info: device_info || null,
      notes: notes || null,
      requested_action: requested_action || "JUST_REPORT",
      status: "open",
      message_id: message_id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Laporan mismatch klaim berhasil dibuat",
      data: report,
    });
  } catch (err) {
    console.error("Error createNotMeReport:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat laporan mismatch klaim",
      error: err.message,
    });
  }
};

/**
 * GET /api/claim-mismatch-reports
 * Optional query:
 *   - status=open|in_review|resolved|invalid
 *   - claim_code=KLAIM-xxxx
 */
exports.listReports = async (req, res) => {
  try {
    const { status, claim_code } = req.query;

    const where = {};
    if (status) where.status = status;
    if (claim_code) where.claim_code = claim_code;

    const reports = await ClaimMismatchReport.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error("Error listReports:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar laporan mismatch",
      error: err.message,
    });
  }
};

/**
 * GET /api/claim-mismatch-reports/:id
 */
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await ClaimMismatchReport.findByPk(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Laporan mismatch tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error("Error getReportById:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail laporan mismatch",
      error: err.message,
    });
  }
};

/**
 * PATCH /api/claim-mismatch-reports/:id
 * Body yang didukung:
 *  - status: open|in_review|resolved|invalid
 *  - handled_by: string
 *  - resolution_notes: string
 */
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, handled_by, resolution_notes } = req.body;

    const report = await ClaimMismatchReport.findByPk(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Laporan mismatch tidak ditemukan",
      });
    }

    // Validasi status kalau diisi
    const allowedStatus = ["open", "in_review", "resolved", "invalid"];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status tidak valid. Gunakan: open | in_review | resolved | invalid",
      });
    }

    if (status) {
      report.status = status;

      // Jika status berubah jadi resolved / invalid dan belum punya handled_at → set sekarang
      if (
        (status === "resolved" || status === "invalid") &&
        !report.handled_at
      ) {
        report.handled_at = new Date();
      }
    }

    if (handled_by !== undefined) {
      report.handled_by = handled_by;
    }

    if (resolution_notes !== undefined) {
      report.resolution_notes = resolution_notes;
    }

    await report.save();

    return res.json({
      success: true,
      message: "Laporan mismatch berhasil diperbarui",
      data: report,
    });
  } catch (err) {
    console.error("Error updateReportStatus:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui laporan mismatch",
      error: err.message,
    });
  }
};
