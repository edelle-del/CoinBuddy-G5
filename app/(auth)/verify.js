import {
    Alert,
    StyleSheet,
    View,
    Pressable,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import ScreenWrapper from "../../components/ScreenWrapper";
  import { StatusBar } from "expo-status-bar";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import BackButton from "@/components/BackButton";
  import Button from "@/components/Button";
  import { verticalScale } from "@/utils/styling";
  import { colors, spacingX, spacingY } from "@/constants/theme";
  import Typo from "@/components/Typo";
  import * as Icons from "phosphor-react-native";
  import { useAuth } from "@/contexts/authContext";
  
  const VerifyEmail = () => {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const { resendVerificationEmail, checkEmailVerification, user } = useAuth();
  
    // Function to verify the email
    const checkVerification = async () => {
      setChecking(true);
      const result = await checkEmailVerification();
      setChecking(false);
  
      if (result.success && result.verified) {
        Alert.alert(
          "Success",
          "Your email has been verified successfully!",
          [{ text: "Continue", onPress: () => router.replace("/(tabs)") }]
        );
      } else if (result.success && !result.verified) {
        Alert.alert(
          "Not Verified",
          "Your email is not verified yet. Please check your inbox and click the verification link."
        );
      } else {
        Alert.alert("Error", result.msg || "An error occurred while checking verification status.");
      }
    };
  
    // Function to resend verification email
    const handleResendEmail = async () => {
      setLoading(true);
      const result = await resendVerificationEmail();
      setLoading(false);
  
      if (result.success) {
        Alert.alert("Success", "Verification email has been sent. Please check your inbox.");
      } else {
        Alert.alert("Error", result.msg || "Failed to send verification email.");
      }
    };
  
    return (
      <ScreenWrapper>
        <StatusBar style="light" />
        <View style={styles.container}>
          <BackButton iconSize={28} onPress={() => router.replace("/(auth)/login")} />
  
          {/* title */}
          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={30} fontWeight={"800"} color={colors.neutral900}>
              Verify
            </Typo>
            <Typo size={30} fontWeight={"800"} color={colors.neutral900}>
              Your Email
            </Typo>
          </View>
  
          {/* content */}
          <View style={styles.content}>
            <Icons.EnvelopeSimple
              size={verticalScale(60)}
              color={colors.primary}
              weight="fill"
            />
            
            <Typo size={18} color={colors.neutral900} style={styles.message}>
              We've sent a verification link to:
            </Typo>
            
            <Typo size={18} fontWeight={"700"} color={colors.primary}>
              {user?.email || email}
            </Typo>
            
            <Typo size={16} color={colors.neutral700} style={styles.instruction}>
              Please check your email inbox and click on the verification link to confirm your account.
            </Typo>
            
            {/* Check verification button */}
            <Button loading={checking} onPress={checkVerification} style={styles.button}>
              <Typo fontWeight={"700"} color={colors.white} size={18}>
                I've Verified My Email
              </Typo>
            </Button>
            
            {/* resend email */}
            <View style={styles.resendContainer}>
              <Typo size={15} color={colors.neutral900}>
                Didn't receive the email?
              </Typo>
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Pressable onPress={handleResendEmail}>
                  <Typo size={15} fontWeight={"700"} color={colors.primary}>
                    Resend Email
                  </Typo>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  };
  
  export default VerifyEmail;
  
  const styles = StyleSheet.cr