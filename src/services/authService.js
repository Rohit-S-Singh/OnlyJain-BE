// src/services/authService.js

const jwt = require('jsonwebtoken');
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Get the Verify Service SID from your .env file
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

/**
 * Sends an OTP using the Twilio Verify service.
 */
const sendOtpService = async (phoneNumber) => {
  if (!phoneNumber || !/^\+91[1-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format. Expected +91XXXXXXXXXX');
  }
  if (!verifyServiceSid) {
      throw new Error('Twilio Verify Service SID is not configured in .env file.');
  }

  try {
    // Let Twilio handle OTP creation and sending
    const verification = await twilio.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    
    console.log(`Twilio Verify request sent to ${phoneNumber} with SID: ${verification.sid}`);
      // Return the standard success object.
  return {
    success: true,
    message: 'OTP sent successfully.',
    data: [],
  };

  } catch (error) {
    console.error("Failed to send OTP via Twilio Verify:", error.message);
    throw new Error('Failed to send OTP. Please check the number and try again.');
  }
};

/**
 * Verifies an OTP using the Twilio Verify service.
 */
const verifyOtpService = async (phoneNumber, otp) => {
  if (!phoneNumber || !otp) {
    throw new Error('Phone number and OTP are required.');
  }

  // 1. Ask Twilio to check the OTP
  const verificationCheck = await twilio.verify.v2.services(verifyServiceSid)
    .verificationChecks
    .create({ to: phoneNumber, code: otp });

  // 2. If Twilio approves, proceed
  if (verificationCheck.status === 'approved') {
    const authToken = jwt.sign(
      { phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 3. Immediately look for the user in your Firestore 'users' collection
    const userRef = db.collection('users').doc(phoneNumber);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // --- Case 2: EXISTING USER ---
      console.log(`Returning user found: ${phoneNumber}`);
      return {
        success: true,
        message: 'Login successful.',
        data: {
          token: authToken,
          user: userDoc.data(), // Send existing user data
          isNewUser: false,
        },
      };
    } else {
      // --- Case 1: NEW USER ---
      console.log(`New user detected: ${phoneNumber}`);
      return {
        success: true,
        message: 'OTP verified. New user.',
        data: {
          token: authToken,
          user: null, // No user data to send yet
          isNewUser: true,
        },
      };
    }
  } else {
    // If Twilio status is not 'approved', it's an error
    throw new Error('The OTP you entered is incorrect or has expired.');
  }
};

module.exports = {
  sendOtpService,
  verifyOtpService,
};