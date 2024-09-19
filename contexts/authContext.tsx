import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/types";
import { auth, firestore } from "@/config/firebase";
import { Router, useRouter, useSegments } from "expo-router";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router: Router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(false);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser?.displayName,
        });

        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, msg: error.message };
    }
  };

  const updateUserData = async (userId: string) => {
    try {
      const docRef = doc(firestore, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && user) {
        const userData = docSnap.data();
        setUser((prevUser) => ({
          ...prevUser!,
          ...userData,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    updateUserData,
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
