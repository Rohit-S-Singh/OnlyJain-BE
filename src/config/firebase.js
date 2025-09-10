const admin = require('firebase-admin');

// IMPORTANT: Make sure this path is correct
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

console.log("Firebase Admin SDK initialized successfully.");

module.exports = { admin, db };