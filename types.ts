import React from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  PressableProps,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: string;
  style?: TextStyle;
};

export type IconComponent = React.ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  //   label?: string;
  //   error?: string;
}

export interface CustomButtonProps extends PressableProps {
  buttonStyle?: ViewStyle;
  textStyle?: TypoProps;
  onPress?: () => void;
  loading?: boolean;
  hasShadow?: boolean;
  children: React.ReactNode;
}

export type UserType = {
  uid: string;
  email: string | null;
  name: string | null;
  image?: string | null;
} | null;

export type AuthContextType = {
  user: UserType;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};
