import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Cloud Function to approve a payment submission.
 * Accessible only by users with role === 'admin'.
 * Sets users/{uid}.plan to the approved tier and updates payment status to 'approved'.
 */
export const approvePayment = functions.https.onCall(async (data, context) => {
  // Enforce authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be signed in to perform admin actions."
    );
  }

  // Check admin role in Firestore
  const callerUid = context.auth.uid;
  const callerSnap = await admin.firestore().collection("users").doc(callerUid).get();
  if (!callerSnap.exists || callerSnap.data()?.role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admin users can approve payment submissions."
    );
  }

  const { paymentId, targetUid, tier } = data;
  if (!paymentId || !targetUid || !tier) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing paymentId, targetUid, or tier."
    );
  }

  const db = admin.firestore();
  const batch = db.batch();

  // 1. Update user plan
  const userRef = db.collection("users").doc(targetUid);
  batch.update(userRef, { plan: tier });

  // 2. Update pending payment status
  const paymentRef = db.collection("pendingPayments").doc(paymentId);
  batch.update(paymentRef, {
    status: "approved",
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewedBy: callerUid,
  });

  await batch.commit();

  return { success: true, message: `Successfully upgraded user ${targetUid} to ${tier}.` };
});
