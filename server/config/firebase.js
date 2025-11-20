const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: serviceAccount.project_id,
      private_key_id: serviceAccount.private_key_id,
      client_email: serviceAccount.client_email,
      client_id: serviceAccount.client_id,

      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

module.exports = admin;
