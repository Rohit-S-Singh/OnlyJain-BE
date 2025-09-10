const jwt = require('jsonwebtoken');
const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const { db } = require('../config/firebase'); // Assuming path is correct

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const verifyOtpService = async (phoneNumber, otp) => {
  if (!phoneNumber || !otp) {
    throw new Error('Phone number and OTP are required.');
  }

  const verificationCheck = await twilio.verify.v2.services(verifyServiceSid)
    .verificationChecks
    .create({ to: phoneNumber, code: otp });

  if (verificationCheck.status === 'approved') {
    const authToken = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userRef = db.collection('users').doc(phoneNumber);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return {
        success: true,
        message: 'Login successful.',
        data: { token: authToken, user: userDoc.data(), isNewUser: false },
      };
    } else {
      return {
        success: true,
        message: 'OTP verified. New user.',
        data: { token: authToken, user: null, isNewUser: true },
      };
    }
  } else {
    throw new Error('The OTP you entered is incorrect or has expired.');
  }
};

module.exports = {
  verifyOtpService,
};