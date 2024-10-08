
import firebase from '@react-native-firebase/firestore';

// Helper function to get the last 12 months with 'Month Short Year' and full date
const getLast12Months = () => {
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let result = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const monthName = monthsOfYear[date.getMonth()];  // Get the month name (e.g., 'Jan')
    const shortYear = date.getFullYear().toString().slice(-2);  // Get the last 2 digits of the year (e.g., '23')
    const formattedMonthYear = `${monthName} ${shortYear}`;  // Format as "Jan 24"
    const formattedDate = date.toISOString().split('T')[0];  // Format full date as YYYY-MM-DD
    
    result.push({
      month: formattedMonthYear,  // "Jan 24" format
      fullDate: formattedDate,    // Full date in "YYYY-MM-DD" format
      income: 0,
      expense: 0
    });
  }
  
  return result;
};

// Function to fetch monthly transactions from Firebase
const fetchMonthlyTransactions = async (uid) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const transactions = await firebase
    .firestore()
    .collection('transactions')
    .where('created', '>=', firebase.firestore.Timestamp.fromDate(twelveMonthsAgo))
    .where('created', '<=', firebase.firestore.Timestamp.fromDate(new Date()))
    .where('uid', '==', uid)
    .get();

  let monthlyData = getLast12Months();

  // Process the transactions
  transactions.forEach(doc => {
    const transaction = doc.data();
    const transactionDate = transaction.created.toDate(); // Convert Firebase timestamp to JS date
    const monthName = transactionDate.toLocaleString('default', { month: 'short' });
    const shortYear = transactionDate.getFullYear().toString().slice(-2);
    const monthData = monthlyData.find(month => month.month === `${monthName} ${shortYear}`);

    if (monthData) {
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthData.expense += transaction.amount;
      }
    }
  });

  return monthlyData;
};
