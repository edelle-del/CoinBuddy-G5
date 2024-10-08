
import firebase from '@react-native-firebase/firestore';

// Helper function to get the range of years from the start year to the current year
const getYearsRange = (startYear, endYear) => {
  let result = [];
  for (let year = startYear; year <= endYear; year++) {
    result.push({
      year: year.toString(),
      fullDate: `01-01-${year}`,
      income: 0,
      expense: 0
    });
  }
  return result;
};

// Function to fetch yearly transactions from Firebase
const fetchYearlyTransactions = async (uid) => {
  const transactions = await firebase
    .firestore()
    .collection('transactions')
    .where('uid', '==', uid)
    .get();

  // Get the first and last year
  const firstTransaction = transactions.docs.reduce((earliest, doc) => {
    const transactionDate = doc.data().created.toDate();
    return transactionDate < earliest ? transactionDate : earliest;
  }, new Date());

  const firstYear = firstTransaction.getFullYear();
  const currentYear = new Date().getFullYear();

  let yearlyData = getYearsRange(firstYear, currentYear);

  // Process the transactions
  transactions.forEach(doc => {
    const transaction = doc.data();
    const transactionYear = transaction.created.toDate().getFullYear();
    const yearData = yearlyData.find(year => year.year === transactionYear.toString());

    if (yearData) {
      if (transaction.type === 'income') {
        yearData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        yearData.expense += transaction.amount;
      }
    }
  });

  return yearlyData;
};
