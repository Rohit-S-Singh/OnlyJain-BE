const express = require('express');
const { sendOtpService, verifyOtpService } = require('../services/authService');
const router = express.Router();

// === POST /api/auth/send-otp ===
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await sendOtpService(phoneNumber);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /send-otp route:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

// === POST /api/auth/verify-otp ===
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const result = await verifyOtpService(phoneNumber, otp);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /verify-otp route:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
});

module.exports = router;