import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";
import CustomTabs from "@/components/CustomTabs";

const _layout = () => {
  return (
    <Tabs
      tabBar={CustomTabs}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral800,
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: colors.neutral400,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icons.House
              size={verticalScale(25)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <Icons.ChartBar
              size={verticalScale(25)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <Icons.Wallet
              size={verticalScale(25)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icons.User
              size={verticalScale(25)}
              weight={focused ? "fill" : "regular"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
