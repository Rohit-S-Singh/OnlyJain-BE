const express = require('express');
const router = express.Router();

// --- FIX: Import each function from its own file ---
const { sendOtpService } = require('../services/sendOtpService');
const { verifyOtpService } = require('../services/verifyOtpService');
const { createProfileService } = require('../services/createProfileService');

// === POST /api/auth/send-otp ===
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await sendOtpService(phoneNumber);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /send-otp route:", error.message);
    res.status(400).json({ success: false, message: error.message, error: error.message });
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
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
});

// === POST /api/auth/create-profile ===
router.post('/create-profile', async (req, res) => {
  try {
    const { phoneNumber, fullName, businessAddress } = req.body;
    const result = await createProfileService(phoneNumber, { fullName, businessAddress });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in /create-profile route:", error.message);
    res.status(400).json({ success: false, message: error.message, error: error.message });
  }
});

module.exports = router;