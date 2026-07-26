// lib/payments.ts — Manual payment flow management (No Storage)
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateReferenceCode } from "./utils";
import type { PlanId, PaymentStatus } from "./config";

export interface PendingPayment {
  id?: string;
  uid: string;
  userEmail: string;
  tier: PlanId;
  priceUsd: number;
  referenceCode: string;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: Timestamp;
  submittedAt?: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  rejectionReason?: string;
}

/**
 * Step 1: Create a pending payment document in Firestore.
 */
export async function createPendingPayment(
  uid: string,
  userEmail: string,
  tier: PlanId,
  priceUsd: number
): Promise<{ docId: string; referenceCode: string }> {
  const referenceCode = generateReferenceCode();
  const docRef = await addDoc(collection(db, "pendingPayments"), {
    uid,
    userEmail,
    tier,
    priceUsd,
    referenceCode,
    status: "awaiting_payment" as PaymentStatus,
    createdAt: serverTimestamp(),
  });
  return { docId: docRef.id, referenceCode };
}

/**
 * Step 2: Submit payment proof (Payoneer transaction ID only).
 */
export async function submitPaymentProof(
  docId: string,
  _uid: string,
  _referenceCode: string,
  transactionId: string
): Promise<void> {
  const paymentRef = doc(db, "pendingPayments", docId);
  await updateDoc(paymentRef, {
    transactionId,
    status: "submitted" as PaymentStatus,
    submittedAt: serverTimestamp(),
  });
}

/**
 * Real-time listener for payment approval status.
 */
export function subscribeToPaymentStatus(
  docId: string,
  onStatusChange: (status: PaymentStatus) => void
): () => void {
  const paymentRef = doc(db, "pendingPayments", docId);
  return onSnapshot(paymentRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      onStatusChange(data.status as PaymentStatus);
    }
  });
}
