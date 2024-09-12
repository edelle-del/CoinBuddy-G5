import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { colors } from "@/constants/theme";
function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabbarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House
        size={verticalScale(29)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    analytics: (isFocused: boolean) => (
      <Icons.ChartBar
        size={verticalScale(29)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocused: boolean) => (
      <Icons.Wallet
        size={verticalScale(29)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused: boolean) => (
      <Icons.User
        size={verticalScale(29)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {tabbarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: verticalScale(70),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabbarItem: {
    marginBottom: verticalScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomTabs;
