import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

type AchievementProps = {
  number: string;
  title: string;
  subtitle: string;
  progress: number;
  reward?: string;
  isComplete?: boolean;
};

type RewardItemProps = {
  title: string;
  location: string;
  currentXP: number;
  requiredXP: number;
};

const Achievement = ({ number, title, subtitle, progress, reward, isComplete = false }: AchievementProps) => {
  return (
    <View style={styles.achievementCard}>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementNumber}>{number}</Text>
        <View>
          <Text style={styles.achievementTitle}>{title}</Text>
          <Text style={styles.achievementSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Progress.Bar 
        progress={progress} 
        width={null} 
        height={8} 
        borderRadius={4}
        color={isComplete ? '#F7D154' : '#CCCCCC'}
        unfilledColor="#EEEEEE"
        borderWidth={0}
        style={styles.progressBar}
      />
      {isComplete ? (
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Claim</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.achievementPoints}>{reward}</Text>
      )}
    </View>
  );
};

const RewardItem = ({ title, location, currentXP, requiredXP }: RewardItemProps) => {
  return (
    <View style={styles.rewardItem}>
      <Text style={styles.rewardTitle}>{title}</Text>
      <Text style={styles.rewardLocation}>{location}</Text>
      <Progress.Bar 
        progress={currentXP / requiredXP}
        width={null}
        height={8}
        borderRadius={4}
        color="#CCCCCC"
        unfilledColor="#EEEEEE"
        borderWidth={0}
        style={styles.progressBar}
      />
      <Text style={styles.xpText}>{currentXP}/{requiredXP} XP</Text>
    </View>
  );
};

const InboxScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>INBOX</Text>
        <View style={styles.divider} />

        {/* Available Rewards Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="bullseye" size={24} color="black" />
            <Text style={styles.sectionTitle}>Available Rewards</Text>
          </View>

          {/* Reward Items */}
          <RewardItem 
            title="10% Off Coupon" 
            location="Local Bookstore" 
            currentXP={0} 
            requiredXP={500} 
          />
          
          <RewardItem 
            title="Free Coffee" 
            location="Campus Cafe" 
            currentXP={0} 
            requiredXP={1000} 
          />
          
          <RewardItem 
            title="Study Supply Kit" 
            location="School Supply Store" 
            currentXP={0} 
            requiredXP={1500} 
          />
        </View>

        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="emoji-events" size={24} color="black" />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>

          {/* Achievement Items */}
          <Achievement 
            number="1"
            title="First Save"
            subtitle="Made your first deposit"
            progress={1.0}
            isComplete={true}
          />
          
          <Achievement 
            number="2"
            title="Budget Master"
            subtitle="Set a budget for each category"
            progress={0.85}
            reward="+100 XP"
          />
          
          <Achievement 
            number="3"
            title="Saving Streak"
            subtitle="Save money 7 days in a row"
            progress={0.6}
            reward="+150 XP"
          />
          
          <Achievement 
            number="4"
            title="Goal Achiever"
            subtitle="Complete your first savings goal"
            progress={0.3}
            reward="+250 XP"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Updated reward styles for the new vertical layout
  rewardItem: {
    marginBottom: 24,
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rewardLocation: {
    fontSize: 16,
    color: '#666666',
    marginTop: 2,
    marginBottom: 8,
  },
  xpText: {
    fontSize: 14,
    color: '#666666',
    alignSelf: 'flex-end',
  },
  // Keep original styles for achievements
  achievementCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  achievementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  progressBar: {
    marginBottom: 8,
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  claimButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  achievementPoints: {
    alignSelf: 'flex-end',
    color: '#666666',
    fontSize: 12,
  },
});

export default InboxScreen;