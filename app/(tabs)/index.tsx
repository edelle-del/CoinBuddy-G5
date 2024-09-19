import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { StatusBar } from "expo-status-bar";
import { colors, radius, spacingX } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import HomeCard from "@/components/HomeCard";
import Button from "@/components/Button";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
const Home = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo fontWeight={"500"} size={20}>
              Syed Noman
            </Typo>
          </View>
          <View style={styles.bell}>
            <Icons.Bell size={verticalScale(22)} color={colors.white} />
          </View>
        </View>

        {/* card */}
        <View style={{ marginTop: 20 }}>
          <HomeCard />
        </View>

        <Button onPress={async () => await signOut(auth)}>
          <Typo color={colors.black}>Logout</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bell: {
    backgroundColor: colors.neutral700,
    padding: 10,
    borderRadius: 50,
  },
});
