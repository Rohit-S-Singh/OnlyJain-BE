const { db } = require('../config/firebase'); // Assuming path is correct

const createProfileService = async (phoneNumber, userData) => {
  if (!phoneNumber || !userData || !userData.fullName) {
    throw new Error('Phone number and user data (including full name) are required.');
  }

  const userRef = db.collection('users').doc(phoneNumber);
  const newUserProfile = {
    id: phoneNumber,
    phoneNumber: phoneNumber,
    fullName: userData.fullName,
    address: userData.businessAddress || '',
    role: 'vendor',
    createdAt: new Date(),
  };

  await userRef.set(newUserProfile);

  return {
    success: true,
    message: 'User profile created successfully.',
    data: newUserProfile,
  };
};

module.exports = {
  createProfileService,
};