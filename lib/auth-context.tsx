"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import type { PlanId, UserRole } from "./config";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: PlanId;
  role: UserRole;
  createdAt: unknown;
  conversionsUsedToday: number;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore user doc whenever auth user changes
  useEffect(() => {
    if (typeof window === "undefined" || !auth.onAuthStateChanged) {
      return;
    }

    try {
      const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);

        if (!firebaseUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        try {
          // Ensure user doc exists
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              email: firebaseUser.email ?? "",
              displayName: firebaseUser.displayName ?? "",
              plan: "free" as PlanId,
              role: "user" as UserRole,
              createdAt: serverTimestamp(),
              conversionsUsedToday: 0,
            });
          }

          // Real-time listener on user profile
          const unsubProfile = onSnapshot(
            userRef,
            (docSnap) => {
              if (docSnap.exists()) {
                setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
              }
              setLoading(false);
            },
            (err) => {
              // Firestore rules not yet deployed — fall back to one-time read data
              console.warn("Firestore snapshot denied (rules not deployed?):", err.message);
              setLoading(false);
            }
          );

          return unsubProfile;

        } catch (err) {
          console.error("Firestore user profile error:", err);
          setLoading(false);
        }
      });

      return () => unsubAuth();
    } catch {
      // Ignore auth listener error
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        email,
        displayName,
        plan: "free" as PlanId,
        role: "user" as UserRole,
        createdAt: serverTimestamp(),
        conversionsUsedToday: 0,
      });
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
