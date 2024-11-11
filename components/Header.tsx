import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
const isIos = Platform.OS == "ios";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style && style]}>
      {title && (
        <Typo
          size={23}
          fontWeight={"600"}
          style={{ marginTop: isIos ? verticalScale(5) : 1 }}
        >
          {title}
        </Typo>
      )}
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 0,
  },
  rightIcon: {
    position: "absolute",
    right: 0,
  },
});
