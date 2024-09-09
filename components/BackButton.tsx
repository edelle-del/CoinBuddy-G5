import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Router, useRouter } from "expo-router";
import { colors, radius } from "@/constants/theme";
import Icon from "@/assets/icons";
// import Icon from "../assets/__icons";

const BackButton = () => {
  const router: Router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.button}>
      <Icon name="arrowLeft" size={30} strokeWidth={2.5} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral800,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
