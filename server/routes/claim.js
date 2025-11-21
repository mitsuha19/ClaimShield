const express = require("express");
const router = express.Router();
const Claim = require("../model/claim");

router.post("/claim", async (req, res) => {
  try {
    const { status } = req.body;
    const claimStatus = status || "pending";

    if (!["pending", "validate", "approve"].includes(claimStatus)) {
      return res
        .status(400)
        .json({ message: "Status must be pending, validate, or approve" });
    }

    const claim = await Claim.create({ status: claimStatus });

    res.status(201).json({
      message: "Claim created successfully",
      claim: { id: claim.id, status: claim.status },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
