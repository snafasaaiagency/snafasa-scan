"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { APP_NAME, TIERS, type PlanId } from "@/lib/config";
import type { PendingPayment } from "@/lib/payments";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterStatus = "all" | "submitted" | "awaiting_payment" | "approved" | "rejected";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("submitted");
  const [actioning, setActioning] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.replace("/");
    }
  }, [loading, user, profile, router]);

  const fetchPayments = useCallback(async () => {
    setFetching(true);
    try {
      const q =
        filter === "all"
          ? query(collection(db, "pendingPayments"), orderBy("createdAt", "desc"))
          : query(
              collection(db, "pendingPayments"),
              where("status", "==", filter),
              orderBy("createdAt", "desc")
            );
      const snap = await getDocs(q);
      setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PendingPayment)));
    } catch {
      // Ignore query error when not logged in or during SSR
    } finally {
      setFetching(false);
    }
  }, [filter]);

  useEffect(() => {
    if (profile?.role !== "admin") return;
    let ignore = false;
    const load = async () => {
      try {
        const q =
          filter === "all"
            ? query(collection(db, "pendingPayments"), orderBy("createdAt", "desc"))
            : query(
                collection(db, "pendingPayments"),
                where("status", "==", filter),
                orderBy("createdAt", "desc")
              );
        const snap = await getDocs(q);
        if (!ignore) {
          setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PendingPayment)));
        }
      } catch {
        // Ignore
      } finally {
        if (!ignore) setFetching(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [filter, profile]);

  const handleApprove = async (payment: PendingPayment) => {
    if (!payment.id || !user) return;
    setActioning(payment.id);
    setActionError(null);
    try {
      // Update payment doc
      await updateDoc(doc(db, "pendingPayments", payment.id), {
        status: "approved",
        reviewedAt: Timestamp.now(),
        reviewedBy: user.uid,
      });
      // Update user plan
      await updateDoc(doc(db, "users", payment.uid), {
        plan: payment.tier as PlanId,
      });
      setPayments((prev) =>
        prev.map((p) => p.id === payment.id ? { ...p, status: "approved" } : p)
      );
    } catch (err) {
      setActionError(`Approve failed: ${(err as Error).message}`);
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (payment: PendingPayment, reason = "Payment could not be verified.") => {
    if (!payment.id || !user) return;
    setActioning(payment.id);
    try {
      await updateDoc(doc(db, "pendingPayments", payment.id), {
        status: "rejected",
        rejectionReason: reason,
        reviewedAt: Timestamp.now(),
        reviewedBy: user.uid,
      });
      setPayments((prev) =>
        prev.map((p) => p.id === payment.id ? { ...p, status: "rejected" } : p)
      );
    } catch (err) {
      setActionError(`Reject failed: ${(err as Error).message}`);
    } finally {
      setActioning(null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      submitted: "badge-warning",
      awaiting_payment: "badge-muted",
      approved: "badge-success",
      rejected: "badge-error",
    };
    return <span className={cn("badge", map[status] ?? "badge-muted")}>{status.replace("_", " ")}</span>;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--color-primary-500)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (profile.role !== "admin") return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "var(--color-primary-100)" }}>
              <Shield className="h-5 w-5" style={{ color: "var(--color-primary-500)" }} />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: "var(--color-text-primary)" }}>
                {APP_NAME} Admin
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Signed in as {profile.email}
              </p>
            </div>
          </div>
          <button onClick={fetchPayments} className="btn btn-ghost btn-sm">
            <RefreshCw className={cn("h-4 w-4", fetching && "animate-spin")} />
            Refresh
          </button>
        </div>

        {actionError && (
          <div className="p-3 mb-4 rounded-lg text-sm"
            style={{ background: "hsl(0 72% 51% / 0.08)", color: "var(--color-error)", border: "1px solid hsl(0 72% 51% / 0.2)" }}>
            {actionError}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["submitted", "awaiting_payment", "approved", "rejected", "all"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("btn btn-sm", filter === f ? "btn-primary" : "btn-ghost")}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Payments table */}
        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 w-full rounded-2xl" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
            <p className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              No payments with status &quot;{filter.replace("_", " ")}&quot;
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => {
              const tier = TIERS.find((t) => t.id === p.tier);
              return (
                <div key={p.id} className="card p-5 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        {statusBadge(p.status)}
                        <span className="badge badge-primary">{tier?.name ?? p.tier}</span>
                        <span className="badge badge-accent">${p.priceUsd} USD</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs"
                        style={{ color: "var(--color-text-secondary)" }}>
                        <span><strong>Email:</strong> {p.userEmail}</span>
                        <span><strong>Reference:</strong> <code className="font-mono font-bold">{p.referenceCode}</code></span>
                        <span><strong>Transaction ID:</strong> <strong className="font-mono text-indigo-500">{p.transactionId || "—"}</strong></span>
                        <span><strong>Submitted:</strong> {p.createdAt?.toDate().toLocaleString()}</span>
                        {p.reviewedAt && (
                          <span><strong>Reviewed:</strong> {p.reviewedAt.toDate().toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {p.status === "submitted" && (
                      <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => handleApprove(p)}
                          disabled={actioning === p.id}
                          className="btn btn-sm flex-1 md:flex-none"
                          style={{ background: "var(--color-success)", color: "white" }}
                        >
                          {actioning === p.id ? (
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(p)}
                          disabled={actioning === p.id}
                          className="btn btn-danger btn-sm flex-1 md:flex-none"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
