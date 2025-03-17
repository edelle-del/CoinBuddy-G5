import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Typo from "./Typo";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

const XPProgressBar = ({ 
  savedMoney = 0,
  weeklyGoal = 100, 
  weeklyExpenses = 0,
  dailyExpenses = 0,
  initialLevel = 0, // Set initial level to 0 for new accounts
  onPress,
  showDetails = false,
  userXP = 0,
  // Function to calculate XP required for next level
  // Default formula: baseXP * level^1.5
  getRequiredXP = (level, baseXP = 50) => Math.floor(baseXP * Math.pow(level, 1.5))
}) => {
  const [level, setLevel] = useState(initialLevel);
  const [currentXP, setCurrentXP] = useState(0);
  const [requiredXP, setRequiredXP] = useState(getRequiredXP(initialLevel || 1)); // Ensure we don't calculate for level 0
  const [progress, setProgress] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  // Calculate daily goal based on weekly goal
  useEffect(() => {
    // Divide weekly goal by 7 to get daily goal
    const calculatedDailyGoal = Math.round(weeklyGoal / 7);
    setDailyGoal(calculatedDailyGoal);
  }, [weeklyGoal]);

  // Calculate XP based on multiple factors, not just saved money
  useEffect(() => {
    // Calculate weekly progress - how well the user is doing against their weekly goal
    const weekProgress = Math.min(1, Math.max(0, (weeklyGoal - weeklyExpenses) / weeklyGoal));
    setWeeklyProgress(weekProgress);

    // Calculate daily progress
    const dayProgress = Math.min(1, Math.max(0, (dailyGoal - dailyExpenses) / dailyGoal));
    setDailyProgress(dayProgress);

    // XP calculation factors:
    // 1. Base XP from saved money (but scaled down to be more reasonable)
    const savingXP = Math.floor(savedMoney * 0.2); // Reduced multiplier from 1 to 0.2
    
    // 2. Bonus XP for meeting spending goals
    const weeklyBonus = weekProgress >= 0.8 ? 50 : weekProgress >= 0.5 ? 20 : 0;
    
    // 3. Bonus XP for meeting daily goals
    const dailyBonus = dayProgress >= 0.9 ? 15 : dayProgress >= 0.7 ? 8 : 0;
    
    // 4. Calculate total XP (could be from a cumulative database value in a real app)
    const calculatedTotalXP = savingXP + weeklyBonus + dailyBonus + userXP;
    setTotalXP(calculatedTotalXP);
    
    // Find the correct level based on total XP
    let currentLevel = 1; // Start at level 1 (not 0)
    let accumulatedXP = 0;
    let xpForNextLevel = getRequiredXP(currentLevel);
    
    // Keep leveling up until we can't anymore
    while (calculatedTotalXP >= accumulatedXP + xpForNextLevel) {
      accumulatedXP += xpForNextLevel;
      currentLevel++;
      xpForNextLevel = getRequiredXP(currentLevel);
    }
    
    // Calculate XP for current level
    const xpInCurrentLevel = calculatedTotalXP - accumulatedXP;
    const progressValue = xpInCurrentLevel / xpForNextLevel;
    
    // Check if user reached a milestone and unlock achievement
    if (currentLevel > level && currentLevel > 1) {
      setAchievementUnlocked(true);
      // Reset achievement notification after 5 seconds
      setTimeout(() => setAchievementUnlocked(false), 5000);
    }
    
    // Update state
    setLevel(currentLevel);
    setCurrentXP(xpInCurrentLevel);
    setRequiredXP(xpForNextLevel);
    setProgress(progressValue);
    
    // Animate progress bar
    Animated.timing(animation, {
      toValue: progressValue,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [savedMoney, weeklyGoal, weeklyExpenses, dailyGoal, dailyExpenses, initialLevel, getRequiredXP]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp'
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {achievementUnlocked && (
        <View style={styles.achievementBadge}>
          <Icons.Trophy 
            size={verticalScale(16)} 
            color={colors.white} 
            weight="fill" 
          />
          <Typo color={colors.white} size={10} fontWeight="bold">
            LEVEL UP!
          </Typo>
        </View>
      )}
      
      <View style={styles.levelBadge}>
        <Icons.Star 
          size={verticalScale(16)} 
          color={colors.white} 
          weight="fill" 
        />
        <Typo color={colors.white} size={12} fontWeight="bold">
          {level}
        </Typo>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Typo size={14} fontWeight="500" color={colors.neutral900}>
            LVL {level}
          </Typo>
          <Typo size={14} fontWeight="500" color={colors.neutral900}>
            {currentXP}/{requiredXP} XP
          </Typo>
        </View>
        
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width }
            ]} 
          />
        </View>
        
        {showDetails && (
          <>
            <View style={styles.progressFooter}>
              <Typo size={12} color={colors.neutral700}>
                Next level in {requiredXP - currentXP} XP
              </Typo>
              <Typo size={12} color={colors.neutral700} fontWeight="500">
                {Math.round(progress * 100)}%
              </Typo>
            </View>
            
            {/* Daily Goal Section */}
            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Typo size={12} fontWeight="500" color={colors.neutral700}>
                  Daily Saving Goal
                </Typo>
                <Typo size={12} color={colors.neutral600}>
                  {Math.round(dailyProgress * 100)}% Complete
                </Typo>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.dailyProgressBar, 
                    { width: `${dailyProgress * 100}%` }
                  ]} 
                />
              </View>
              
              <View style={styles.progressFooter}>
                <Typo size={12} color={colors.neutral700}>
                  ₱{dailyExpenses} spent of ₱{dailyGoal} goal
                </Typo>
                <Typo size={12} color={dailyProgress >= 0.9 ? colors.blue : colors.neutral700} fontWeight="500">
                  {dailyProgress >= 0.9 ? 'Great! (+15 XP)' : dailyProgress >= 0.7 ? 'Good Progress! (+8 XP)' : 'Keep Going!'}
                </Typo>
              </View>
            </View>
            
            {/* Weekly Goal Section */}
            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Typo size={12} fontWeight="500" color={colors.neutral700}>
                  Weekly Saving Goal
                </Typo>
                <Typo size={12} color={colors.neutral600}>
                  {Math.round(weeklyProgress * 100)}% Complete
                </Typo>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.weeklyProgressBar, 
                    { width: `${weeklyProgress * 100}%` }
                  ]} 
                />
              </View>
              
              <View style={styles.progressFooter}>
                <Typo size={12} color={colors.neutral700}>
                  ₱{weeklyExpenses} spent of ₱{weeklyGoal} goal
                </Typo>
                <Typo size={12} color={weeklyProgress >= 0.8 ? colors.green : colors.neutral700} fontWeight="500">
                  {weeklyProgress >= 0.8 ? 'On Track! (+50 XP)' : weeklyProgress >= 0.5 ? 'Keep Going! (+20 XP)' : 'Keep Going!'}
                </Typo>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Icons.Wallet size={verticalScale(16)} color={colors.green} weight="fill" />
                <Typo size={12} color={colors.neutral700}>
                  ₱{savedMoney} Saved
                </Typo>
              </View>
              <View style={styles.statItem}>
                <Icons.ChartLineUp size={verticalScale(16)} color={colors.green} weight="fill" />
                <Typo size={12} color={colors.neutral700}>
                  {totalXP} Total XP
                </Typo>
              </View>
            </View>
          </>
        )}
        
        {!showDetails && (
          <View style={styles.hintContainer}>
            <Icons.Info size={verticalScale(12)} color={colors.neutral600} />
            <Typo size={10} color={colors.neutral600}>
              Tap to view details
            </Typo>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX._15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: spacingY._10,
    position: "relative",
  },
  levelBadge: {
    backgroundColor: "#00723F", // Green color
    width: verticalScale(35),
    height: verticalScale(35),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacingX._10,
    flexDirection: "row",
    gap: 2,
  },
  progressContainer: {
    flex: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.neutral200,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00723F", // Green color
    borderRadius: 4,
  },
  weeklyProgressBar: {
    height: "100%",
    backgroundColor: "#FFC107", // Amber color
    borderRadius: 4,
  },
  dailyProgressBar: {
    height: "100%",
    backgroundColor: "#2196F3", // Blue color
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  goalContainer: {
    marginTop: spacingY._10,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacingY._10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 2,
  },
  achievementBadge: {
    position: "absolute",
    top: -10,
    right: 10,
    backgroundColor: "#FFC107", // Amber color 
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 1,
  }
});

export default XPProgressBar;