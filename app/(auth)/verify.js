import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext({});

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email with code
const sendVerificationCode = async (email, code) => {
  // This would typically use a server endpoint or Firebase Cloud Functions
  // For demo purposes, we'll just log the code and simulate sending
  console.log(`Verification code ${code} would be sent to ${email}`);
  
  // In a real app, you would call your backend API here, e.g:
  // await fetch('Ahttps://yourapi.com/send-verification', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, code }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
  
  return true;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check user verification status in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().isVerified) {
          setUser({
            uid: user.uid,
            email: user.email,
            name: userDoc.data().name,
          });
        } else {
          // User exists but not verified
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is verified in Firestore
      const userDoc = await getDoc(doc(db, "users", response.user.uid));
      
      if (!userDoc.exists() || !userDoc.data().isVerified) {
        return {
          success: false,
          msg: "Please verify your email before logging in.",
          needsVerification: true,
          email: email
        };
      }
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.message,
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      // Create the user
      const response = await createUserWithEmailAndPassword(auth, email, password);
      
      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Store user data in Firestore with verification code
      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        email,
        name,
        isVerified: false,
        verificationCode,
        createdAt: new Date(),
      });
      
      // Send verification code to user's email
      await sendVerificationCode(email, verificationCode);
      
      return { success: true, email };
    } catch (err) {
      return {
        success: false,
        msg: err.message,
      };
    }
  };

  // Function to verify email with code
  const verifyEmail = async (email, code) => {
    try {
      // Find user by email (in a real app, you'd have a better way to look this up)
      if (!auth.currentUser) {
        return {
          success: false,
          msg: "Please login first",
        };
      }
      
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      
      if (!userDoc.exists()) {
        return {
          success: false,
          msg: "User not found",
        };
      }
      
      // Check verification code
      if (userDoc.data().verificationCode !== code) {
        return {
          success: false,
          msg: "Invalid verification code",
        };
      }
      
      // Update user as verified
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isVerified: true,
      });
      
      // Update local user state
      setUser({
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: userDoc.data().name,
      });
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.message,
      };
    }
  };

  // Function to resend verification code
  const resendVerificationCode = async (email) => {
    try {
      if (!auth.currentUser) {
        return {
          success: false,
          msg: "Please login first",
        };
      }
      
      // Generate new verification code
      const verificationCode = generateVerificationCode();
      
      // Update the verification code in Firestore
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        verificationCode,
      });
      
      // Send the new verification code
      await sendVerificationCode(email, verificationCode);
      
      return { success: true };
    } catch (err) {
      return {
        success: false,
        msg: err.message,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyEmail,
        resendVerificationCode,
        loadingInitial,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};