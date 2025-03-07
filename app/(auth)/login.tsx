import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { scale, verticalScale } from "@/utils/styling";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "@/components/Typo";
import * as Icons from "phosphor-react-native";
import { useAuth } from "@/contexts/authContext";

// Define a proper type for the login response
interface LoginResponse {
  success: boolean;
  msg?: string;
  needsVerification?: boolean;
  email?: string;
}

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "please fill all the fields!");
      return;
    }
    setLoading(true);
    // Cast the response to the LoginResponse type
    const res = await login(emailRef.current, passwordRef.current) as LoginResponse;
    setLoading(false);
    
    if (!res.success) {
      if (res.needsVerification) {
        // Navigate to verification screen if email isn't verified
        router.push({
          pathname: "/(auth)/verify",
          params: { email: res.email }
        });
      } else {
        Alert.alert("Login", res.msg);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />
        {/* welcome */}
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"} color={colors.neutral900}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"} color={colors.neutral900}>
            Welcome Back
          </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.neutral900}>
            Login now to track all your expenses
          </Typo>
          <Input
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral900}
                weight="fill"
              />
            }
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          
          {/* Custom password input with toggle */}
          <View style={styles.passwordWrapper}>
            <Input
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral900}
                  weight="fill"
                />
              }
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              onChangeText={(value) => (passwordRef.current = value)}
            />
            <Pressable
              onPress={togglePasswordVisibility}
              style={sty