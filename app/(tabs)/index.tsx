import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import HomeCard from "@/components/HomeCard";
import Button from "@/components/Button";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import TransactionList from "@/components/TransactionList";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import XPProgressBar from "@/components/XPProgressBar";
const CoinBuddyLogo = require("@/assets/images/CoinBuddyLogo.png");

// Updated Achievement interface
interface Achievement {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  claimable: boolean;
  xpPoints: number;
  icon: keyof typeof Icons;
}

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [savedMoney, setSavedMoney] = useState(240); // Example: money saved
  const [weeklyGoal, setWeeklyGoal] = useState(500); // Weekly spending goal
  const [weeklyExpenses, setWeeklyExpenses] = useState(260); // Weekly expenses
  const [showXPDetails, setShowXPDetails] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const xpPerPeso = 1; // XP per peso saved
  const [userXP, setUserXP] = useState(0);


  // Mock achievements with new properties
  const [achievements, setAchievements] = useState<Achievement[]>([
  { 
    id: 1, 
    title: "Money Saver", 
    description: "Save your first ₱100", 
    completed: true, 
    claimable: true, 
    xpPoints: 50,
    icon: "Wallet" 
  },
  { 
    id: 2, 
    title: "Budget Master", 
    description: "Stay under budget for 3 weeks", 
    completed: true, 
    claimable: true, 
    xpPoints: 100,
    icon: "ChartBar" 
  },
  { 
    id: 3, 
    title: "Level 5 Reached", 
    description: "Reach level 5 in your saving journey", 
    completed: false, 
    claimable: false, 
    xpPoints: 150,
    icon: "Star" 
  },
  { 
    id: 4, 
    title: "Track Star", 
    description: "Log transactions for 7 consecutive days", 
    completed: true, 
    claimable: true, 
    xpPoints: 75,
    icon: "CheckCircle" 
  },
  { 
    id: 5, 
    title: "Big Saver", 
    description: "Save ₱1000 in a single month", 
    completed: false, 
    claimable: false, 
    xpPoints: 200,
    icon: "CurrencyCircleDollar" 
  },
]);


  const constraints = [
    where("uid", "==", user?.uid), // Filter by user ID
    orderBy("date", "desc"), // Order by creation date in descending order
    limit(30), // Limit the results to 30 transactions
  ];

  // Use the useFetchData hook with the 'transactions' collection and constraints
  const {
    data: recentTransactions,
    loading: transactionsLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);

  // Calculate saved money based on transactions (example calculation)
  useEffect(() => {
    if (recentTransactions && recentTransactions.length > 0) {
      // If t.date is a string (which appears to be the case based on the error)
        const lastWeekTransactions = recentTransactions.filter(
          (t) => {
            // Parse the date string to a Date object if it's a string
            const transactionDate = typeof t.date === 'string' 
              ? new Date(t.date) 
              : t.date instanceof Date 
                ? t.date 
                : new Date(); // Fallback in case t.date is neither string nor Date
                
            // Compare with 7 days ago
            return transactionDate.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
          }
        );
      
      const incomeTransactions = lastWeekTransactions.filter(t => t.type === "income");
      const expenseTransactions = lastWeekTransactions.filter(t => t.type === "expense");
      
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      setWeeklyExpenses(totalExpense);
      setSavedMoney(totalIncome - totalExpense > 0 ? totalIncome - totalExpense : 0);
    }
  }, [recentTransactions]);

  const logout = async () => {
    await signOut(auth);
  };

  // Modify the renderAchievementItem to include XP claim
  const renderAchievementItem = (achievement: Achievement) => {
    const IconComponent = Icons[achievement.icon] as React.ElementType;
    
    return (
      <View key={achievement.id} style={styles.achievementItem}>
        <View style={[styles.achievementIcon, { backgroundColor: achievement.completed ? colors.green : colors.neutral300 }]}>
          <IconComponent 
            size={verticalScale(22)} 
            color={colors.white} 
            weight="fill" 
          />
        </View>
        <View style={styles.achievementInfo}>
          <Typo size={14} fontWeight="500" color={colors.neutral900}>
            {achievement.title}
          </Typo>
          <Typo size={12} color={colors.neutral700}>
            {achievement.description}
          </Typo>
          {achievement.completed && achievement.claimable && (
            <Typo size={12} color={colors.green}>
              +{achievement.xpPoints} XP Available
            </Typo>
          )}
        </View>
        {achievement.completed && achievement.claimable && (
          <TouchableOpacity onPress={() => claimAchievementXP(achievement)}>
            <Icons.ArrowCircleUp
              size={verticalScale(20)} 
              color={colors.green} 
              weight="fill" 
            />
          </TouchableOpacity>
        )}
        {achievement.completed && !achievement.claimable && (
          <Icons.CheckCircle 
            size={verticalScale(20)} 
            color={colors.green} 
            weight="fill" 
          />
        )}
      </View>
    );
  };

  // Function to claim achievement XP
  const claimAchievementXP = (achievement: Achievement) => {
    if (achievement.completed && achievement.claimable) {
      // Update XP
      setUserXP(prevXP => prevXP + achievement.xpPoints);
      
      // Mark achievement as claimed using state update
      setAchievements(prevAchievements => 
        prevAchievements.map(a => 
          a.id === achievement.id 
            ? { ...a, claimable: false } 
            : a
        )
      );
    }
  };


  // Update the achievements progress calculation
  const completedAchievements = achievements.filter(a => a.completed);
  const claimableAchievements = achievements.filter(a => a.completed && a.claimable);

  return (
    <ScreenWrapper>
      {/* Logo + Title */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 20 }}>
        <Image
          source={CoinBuddyLogo}  
          style={{ width: 130, height: 50, resizeMode: "contain" }} 
        />
      </View>

      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          {/*greeting*/}
          <View style={{ gap: 4 }}>
            <Typo fontWeight={"500"} size={20} color={colors.neutral900}>
              Hello, <Typo fontWeight={"500"} size={20} color={colors.green}>
              {user?.name || "Name"}
            </Typo>
            </Typo>
          </View>
          
          {/*trophy*/}
          <TouchableOpacity
            style={styles.trophyButton}
            onPress={() => setShowAchievements(true)}
          >
            <Icons.Trophy
              size={verticalScale(22)}
              color={colors.neutral900}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        {/* XP Progress Bar */}
        <XPProgressBar 
          savedMoney={savedMoney}
          weeklyGoal={weeklyGoal}
          weeklyExpenses={weeklyExpenses}
          initialLevel={0}
          showDetails={showXPDetails}
          onPress={() => setShowXPDetails(!showXPDetails)}
        />

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>

          <TransactionList 
            title={"Recent Transactions"}
            loading={transactionsLoading}
            data={recentTransactions}
            emptyListMessage="No Transactions added yet!"
            rightElement={
              <TouchableOpacity
                onPress={() => router.push("/(modals)/searchModal")}
              >
                <Icons.MagnifyingGlass
                  size={verticalScale(22)}
                  color={colors.neutral900}
                  weight="bold"
                />
              </TouchableOpacity>
            }
          />
        </ScrollView>
        
        <Button
          onPress={() => router.push("/(modals)/transactionModal")}
          style={styles.floatingButton}
        >
          <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
          />
        </Button>
        
        {/* Achievements Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAchievements}
          onRequestClose={() => setShowAchievements(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Typo size={18} fontWeight="bold" color={colors.neutral900}>
                  Your Achievements
                </Typo>
                <TouchableOpacity onPress={() => setShowAchievements(false)}>
                  <Icons.X size={verticalScale(24)} color={colors.neutral900} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.achievementsProgress}>
                <Typo size={14} color={colors.neutral700}>
                  {completedAchievements.length} of {achievements.length} completed
                </Typo>
                <Typo size={12} color={colors.green}>
                  {claimableAchievements.length} achievements ready to claim
                </Typo>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(completedAchievements.length / achievements.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <ScrollView style={styles.achievementsList}>
                {achievements.map(renderAchievementItem)}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  trophyButton: {
    alignItems: "center", 
    justifyContent: "center", 
    width: verticalScale(30),
    height: verticalScale(30),
    borderRadius: 15,
    backgroundColor: colors.neutral100,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingX._20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX._20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._15,
    paddingBottom: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  achievementsProgress: {
    marginBottom: spacingY._15,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.neutral200,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 4,
  },
  achievementsList: {
    maxHeight: '80%',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  achievementIcon: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: 20,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingX._10,
  },
  achievementInfo: {
    flex: 1,
  }
});