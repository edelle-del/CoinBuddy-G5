import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      <View
        style={[styles.button, buttonStyle, { backgroundColor: "transparent" }]}
      >
        <Loading />
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(54),
    justifyContent: "center",
    alignItems: "center",
  },
});
