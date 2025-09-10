const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const sendOtpService = async (phoneNumber) => {
  if (!phoneNumber || !/^\+91[1-9]\d{9}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format. Expected +91XXXXXXXXXX');
  }
  if (!verifyServiceSid) {
      throw new Error('Twilio Verify Service SID is not configured in .env file.');
  }

  try {
    const verification = await twilio.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    
    console.log(`Twilio Verify request sent to ${phoneNumber} with SID: ${verification.sid}`);
    return {
      success: true,
      message: 'OTP sent successfully.',
      data: null,
    };
  } catch (error) {
    console.error("Failed to send OTP via Twilio Verify:", error.message);
    throw new Error('Failed to send OTP. Please check the number and try again.');
  }
};

module.exports = {
  sendOtpService,
};