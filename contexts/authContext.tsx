import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/types";
import { auth, firestore } from "@/config/firebase";
import { Router, useRouter, useSegments } from "expo-router";
import { sendEmailVerification } from "firebase/auth";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router: Router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // console.log("got user in auth state changed: ", firebaseUser);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)"as any);
      } else {
        setUser(null);
        router.replace('/(auth)/welcome' as any);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;

      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already in use";

      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      // console.log("updating data for : ", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        // console.log("updated user data: ", userData);
        setUser({ ...user, ...userData });
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      } catch (error: any) {
        return { success: false, msg: error.message };
      }
    } else {
      return { success: false, msg: "No authenticated user found." };
    }
  };

  const checkEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload(); // Refresh user state
        return { success: true, verified: auth.currentUser.emailVerified };
      } catch (error: any) {
        return { success: false, msg: error.message };
      }
    } else {
      return { success: false, msg: "No authenticated user found." };
    }
  };
  
  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
    resendVerificationEmail,
    checkEmailVerification,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
