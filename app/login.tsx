import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import { colors, spacingX } from "@/constants/theme";
import Typo from "@/components/Typo";
import Icon from "@/assets/icons";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "please fill all the fields!");
      return;
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton />

        {/* welcome */}
        <View style={{ gap: 5, marginTop: verticalScale(20) }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expaneses
          </Typo>
          <Input
            icon={
              <Icon name="mail" color={colors.neutral300} strokeWidth={1.6} />
            }
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={
              <Icon name="lock" color={colors.neutral300} strokeWidth={1.6} />
            }
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>
          {/* button */}
          <Button loading={loading} onPress={onSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Dont't have an account?</Typo>
          <Pressable onPress={() => router.push("/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: verticalScale(30),
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
