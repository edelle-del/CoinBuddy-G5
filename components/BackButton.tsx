import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { Router, useRouter } from "expo-router";
import { colors, radius } from "@/constants/theme";
import { CaretLeft } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { BackButtonProps } from "@/types";
// import Icon from "../assets/__icons";

const BackButton = ({
  style,
  iconSize = verticalScale(28),
}: BackButtonProps) => {
  const router: Router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style && style]}
    >
      <CaretLeft size={iconSize} color={colors.white} weight="bold" />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
