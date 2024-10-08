
import firebase from '@react-native-firebase/firestore';

// Helper function to get the past 7 days with day names and full date
const getLast7Days = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = daysOfWeek[date.getDay()];
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    
    result.push({
      day: dayName,
      date: formattedDate,
      income: 0,
      expense: 0
    });
  }
  
  return result;
};

// Function to fetch weekly transactions from Firebase
const fetchWeeklyTransactions = async (uid) => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
  
  const transactions = await firebase
    .firestore()
    .collection('transactions')
    .where('created', '>=', firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
    .where('created', '<=', firebase.firestore.Timestamp.fromDate(new Date()))
    .where('uid', '==', uid)
    .get();
  
  let weeklyData = getLast7Days();
  
  // Process the transactions
  transactions.forEach(doc => {
    const transaction = doc.data();
    const transactionDate = transaction.created.toDate().toISOString().split('T')[0]; // Convert Firebase timestamp to JS date
    const dayData = weeklyData.find(day => day.date === transactionDate);
    
    if (dayData) {
      if (transaction.type === 'income') {
        dayData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        dayData.expense += transaction.amount;
      }
    }
  });

  return weeklyData;
};
