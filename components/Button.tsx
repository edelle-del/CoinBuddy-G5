import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { Children } from "react";
import { CustomButtonProps } from "@/types";
import Loading from "./Loading";
import Typo from "./Typo";
import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Button = ({
  buttonStyle,
  onPress,
  loading = false,
  hasShadow = true,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle]}>
        <Loading />
      </View>
    );
  }
  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
      {children}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._15,
    borderCurve: "continuous",
    height: verticalScale(54),
    justifyContent: "center",
    alignItems: "center",
  },
});
