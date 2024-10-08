import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { BarChart } from "react-native-gifted-charts";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Loading from "@/components/Loading";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { scale, verticalScale } from "@/utils/styling";

const barData = [
  {
    value: 40,
    label: "Mon",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
    // topLabelComponent: () => (
    //   <Typo size={10} style={{ marginBottom: 4 }}>
    //     50
    //   </Typo>
    // ),
  },
  { value: 20, frontColor: colors.rose },

  {
    value: 50,
    label: "Tue",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 40, frontColor: colors.rose },
  {
    value: 75,
    label: "Wed",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 25, frontColor: colors.rose },
  {
    value: 30,
    label: "Thu",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 20, frontColor: colors.rose },
  {
    value: 60,
    label: "Fri",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 40, frontColor: colors.rose },
  {
    value: 65,
    label: "Sat",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 30, frontColor: colors.rose },
  {
    value: 65,
    label: "Sun",
    spacing: 4,
    labelWidth: 30,
    frontColor: colors.primary,
  },
  { value: 30, frontColor: colors.rose },
  // {
  //   value: 65,
  //   label: "Sun",
  //   spacing: 4,
  //   labelWidth: 30,
  //   frontColor: colors.primary,
  // },
  // { value: 30, frontColor: colors.rose },
];

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* segments */}

        <SegmentedControl
          values={["Weekly", "Monthly", "Yearly"]}
          selectedIndex={activeIndex}
          tintColor={colors.neutral200}
          backgroundColor={colors.neutral800}
          appearance="dark"
          activeFontStyle={styles.segmentFontStyle}
          fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          style={styles.segmentStyle}
          onChange={(event) =>
            setActiveIndex(event.nativeEvent.selectedSegmentIndex)
          }
        />

        <View style={styles.loading}>
          <BarChart
            data={barData}
            barWidth={scale(12)}
            spacing={scale(12)}
            roundedTop
            roundedBottom
            hideRules
            yAxisLabelPrefix="$"
            xAxisThickness={0}
            yAxisThickness={0}
            // hideYAxisText
            yAxisTextStyle={{ color: colors.neutral350 }}
            xAxisLabelTextStyle={{ color: colors.neutral350 }}
            noOfSections={3}
            // maxValue={100}
            animationDuration={500}
            isAnimated={true}
          />
          {loading && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: radius._12,
                backgroundColor: "rgba(0,0,0, 0.6)",
              }}
            >
              <Loading color="white" />
            </View>
          )}
        </View>

        <View>
          <Typo>Top Income & Expenses</Typo>
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
    marginBottom: spacingY._20,
  },
  segmentStyle: {
    height: scale(37),
    marginBottom: verticalScale(30),
  },
  segmentFontStyle: {
    fontSize: verticalScale(12),
    fontWeight: "700",
    color: colors.black,
  },
  container: {
    padding: spacingX._20,
  },
});
