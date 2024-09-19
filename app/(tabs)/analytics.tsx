import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { BarChart } from "react-native-gifted-charts";
import { colors, radius, spacingX } from "@/constants/theme";
import Loading from "@/components/Loading";

const barData = [
  {
    value: 40,
    label: "Jan",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 20, frontColor: colors.neutral400 },

  {
    value: 50,
    label: "Feb",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 40, frontColor: colors.neutral400 },
  {
    value: 75,
    label: "Mar",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 25, frontColor: colors.neutral400 },
  {
    value: 30,
    label: "Apr",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 20, frontColor: colors.neutral400 },
  {
    value: 60,
    label: "May",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 40, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Jun",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
  {
    value: 65,
    label: "Dec",
    spacing: 2,
    labelWidth: 30,
    labelTextStyle: { color: "gray" },
    frontColor: "#86efac",
  },
  { value: 30, frontColor: colors.neutral400 },
];

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.loading}>
          <BarChart
            data={barData}
            barWidth={20}
            spacing={14}
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: "gray" }}
            noOfSections={3}
            maxValue={100}
          />
          {loading && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: radius._12,
                backgroundColor: "rgba(0,0,0, 0.7)",
              }}
            >
              <Loading color="white" />
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  loading: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: spacingX._20,
  },
});
