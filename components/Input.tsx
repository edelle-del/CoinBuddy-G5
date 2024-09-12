import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { InputProps } from "@/types";

const Input = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[
          { flex: 1, color: colors.white, fontSize: verticalScale(14) },
          props.inputStyle,
        ]}
        placeholderTextColor={colors.neutral300}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
