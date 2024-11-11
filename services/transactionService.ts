import { ResponseType, TransactionType, WalletType } from "@/types";
import { uploadFile } from "./imageService";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, amount, walletId, image } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return {
        success: false,
        msg: "Invalid transaction data!",
      };
    }

    // Fetch the original transaction if updating
    if (id) {
      // Fetch the old transaction data
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOriginal) {
        // Check if we need to revert the original transaction (type, amount, or wallet changed)
        let res = await revertAndUpdateWallets(
          oldTransaction, // Old transaction
          Number(amount!), // New transaction amount
          type, // New transaction type ('income' or 'expense')
          walletId! // New wallet ID
        );

        if (!res.success) return res;
      }
    } else {
      // Handle wallet updates for new transactions
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    // Upload image if provided
    if (image) {
      const imageUploadResponse = await uploadFile(image, "transactions");
      if (!imageUploadResponse.success) {
        return {
          success: false,
          msg: imageUploadResponse.msg || "Failed to upload image",
        };
      }
      transactionData.image = imageUploadResponse.data;
    }

    // Create or update the transaction
    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));
    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.error("Error creating or updating transaction:", error);
    return { success: false, msg: error.message };
  }
};

export const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    // Fetch the wallet
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.error("Wallet not found");
      return { success: false, msg: "Wallet not found!" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance",
      };
    }

    // Adjust wallet balance and totals based on the transaction type
    const updatedWalletAmount =
      type === "income"
        ? walletData.amount! + amount // Add income to wallet balance
        : walletData.amount! - amount; // Subtract expense from wallet balance

    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedTotals =
      type === "income"
        ? walletData.totalIncome! + amount
        : walletData.totalExpenses! + amount;

    // Update the wallet
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating wallet for new transaction:", error);
    return { success: false, msg: "Could not update the wallet!" };
  }
};

export const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    // Fetch the original wallet data before updating the amounts
    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );
    const originalWallet = originalWalletSnapshot.data() as WalletType;

    // Fetch the new wallet data
    const newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );
    const newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    // Revert the previous transaction's effect on wallet balance and income/expense totals
    // the amount that we need to add or subtract
    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount!) // Subtract income from wallet balance
        : Number(oldTransaction.amount!); // Add back expense to wallet balance

    const revertedWalletAmount = originalWallet.amount! + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      originalWallet[revertType]! - Number(oldTransaction.amount!);

    console.log("reverted wallet amount: ", revertedWalletAmount);

    // check if the user is trying to conver the income to expense on the same wallet

    if (newTransactionType == "expense") {
      // if the user tries to convert the income to expense on the same wallet
      // or if the user tries to increase the expense amount and don't have anough balance on the same amount
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        console.log(
          "same wallet, the wallet balance after transaction: ",
          revertedWalletAmount - newTransactionAmount
        );
        return {
          success: false,
          msg: "The selected wallet don't have enough balance!",
        };
      }

      // if user tries to add expense from a new wallet but the new wallet don't have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        console.log(
          "new wallet amount after transaction: ",
          newWallet.amount! - newTransactionAmount
        );
        return {
          success: false,
          msg: "The selected wallet don't have enough balance!",
        };
      }
    }

    // Update the original wallet
    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    ////////////////////////////////////////////////////////////////////////////

    // Apply the new transaction to the new wallet
    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";
    const updateWalletAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount) // Add income to wallet balance
        : -Number(newTransactionAmount); // Subtract expense from wallet balance

    const newWalletAmount = newWallet.amount! + updateWalletAmount;

    const newIncomeExpenseAmount =
      newWallet[updateType]! + Number(newTransactionAmount);

    // Update the new wallet
    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating wallets:", error);
    // You can log or handle the error as needed here
    return { success: false, msg: "Could not update the wallet!" };
  }
};
