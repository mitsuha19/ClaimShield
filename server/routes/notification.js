// server/routes/notification.js
const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");

// POST /api/send-notif
router.post("/send-notif", async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "token required" });
    }

    const message = {
      token,
      notification: {
        title: title || "Hello from ClaimShield",
        body: body || "This is a test notification",
      },
      data: data || {}, // custom payload yang bisa kamu baca di Flutter
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);

    return res.json({ success: true, messageId: response });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
