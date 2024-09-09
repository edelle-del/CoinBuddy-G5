import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 35;
  return (
    <View
      style={[
        { paddingTop, flex: 1, backgroundColor: colors.neutral900 },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
