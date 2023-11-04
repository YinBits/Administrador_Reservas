const functions = require("firebase-functions");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

admin.initializeApp();

exports.createCustomToken = functions.https.onCall((data, context) => {
  const { uid, email } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Usuário não autenticado.");
  }

  const customToken = jwt.sign({ uid, email }, "tinaB0Tina", { expiresIn: "1h" });
  return { token: customToken };
});
