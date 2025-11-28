// routes/claimMismatchReportRoutes.js
const express = require("express");
const router = express.Router();

const {
  createNotMeReport,
  listReports,
  getReportById,
  updateReportStatus,
} = require("../controller/claimMismatchReportController");

// Mobile: user lapor "bukan saya" setelah menerima notifikasi
// POST /api/claims/:claimCode/report-not-me
router.post("/claims/:claimCode/report-not-me", createNotMeReport);

// Admin / BPJS: lihat semua laporan mismatch
// GET /api/claim-mismatch-reports?status=open&claim_code=KLAIM-001
router.get("/claim-mismatch-reports", listReports);

// Detail laporan
// GET /api/claim-mismatch-reports/:id
router.get("/claim-mismatch-reports/:id", getReportById);

// Update status laporan (open → in_review → resolved/invalid, dsb.)
// PATCH /api/claim-mismatch-reports/:id
router.patch("/claim-mismatch-reports/:id", updateReportStatus);

module.exports = router;
