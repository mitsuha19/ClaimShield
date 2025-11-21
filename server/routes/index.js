const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to ClaimShield API",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/ping", (req, res) => {
  res.json({ message: "Pong! Server is alive." });
});

module.exports = router;
