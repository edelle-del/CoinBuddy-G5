import { Image, ImageSourcePropType } from "react-native";
import React from "react";
import { scale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { IconProps } from "@/types";

const icons: { [key: string]: ImageSourcePropType } = {
  arrowLeft: require("./arrowLeft.png"),
  home: require("./home.png"),
  mail: require("./mail.png"),
};

const Icon = ({ name, size = 22, color = colors.white }: IconProps) => {
  return (
    <Image
      source={icons[name]}
      style={{ height: scale(size), width: scale(size), tintColor: color }}
    />
  );
};

export default Icon;
