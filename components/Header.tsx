import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";
import BackButton from "./BackButton";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Header = ({ title = "", showBackIcon = true, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style && style]}>
      {title && (
        <Typo
          size={23}
          fontWeight={"600"}
          style={{ marginTop: verticalScale(5) }}
        >
          {title}
        </Typo>
      )}
      {showBackIcon && (
        <View style={styles.backButton}>
          <BackButton
            style={{ backgroundColor: colors.neutral600 }}
            iconSize={verticalScale(24)}
          />
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
});
