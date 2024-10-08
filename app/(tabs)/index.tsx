import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { StatusBar } from "expo-status-bar";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { scale, verticalScale } from "@/utils/styling";
import HomeCard from "@/components/HomeCard";
import Button from "@/components/Button";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { Router, useRouter } from "expo-router";
const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
  };
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
              {user?.name || ""}
            </Typo>
          </View>
          <View style={styles.bell}>
            <Icons.Bell size={verticalScale(22)} color={colors.white} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          {/* card */}
          <View>
            <HomeCard />
          </View>

          {/* <Button onPress={logout}>
            <Typo color={colors.black}>Logout</Typo>
          </Button> */}
        </ScrollView>
        <Button
          onPress={() => router.push("/(modals)/transactionModal")}
          buttonStyle={styles.floatingButton}
        >
          <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
          />
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
    marginBottom: spacingY._10,
  },
  bell: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: 30,
    right: 30,
  },

  scrollViewStyle: {
    flex: 1,
    marginTop: spacingY._10,
  },
});
