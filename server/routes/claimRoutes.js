// routes/claimRoutes.js
const express = require("express");
const router = express.Router();
const claimController = require("../controller/claimController");

router.get("/claims", claimController.getAllClaims);

// Detail klaim by ID (primary key auto increment)
router.get("/claims/:id", claimController.getClaimById);

// Buat klaim baru
router.post("/claims", claimController.createClaim);

// Update full data klaim
router.put("/claims/:id", claimController.updateClaim);

// Update hanya status klaim (dan opsional blockchain_tx_id)
router.patch("/claims/:id/status", claimController.updateClaimStatus);

// Hapus klaim
router.delete("/claims/:id", claimController.deleteClaim);

module.exports = router;
