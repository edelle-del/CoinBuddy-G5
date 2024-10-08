import { doc, setDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { uploadFile } from "./imageService";
import { ResponseType, WalletType } from "@/types";
import { firestore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: WalletType
): Promise<ResponseType> => {
  try {
    // upload image
    const imageUploadResponse = await uploadFile(walletData.image, "wallets");

    if (!imageUploadResponse.success) {
      return {
        success: false,
        msg: imageUploadResponse.msg || "Failed to upload image",
      };
    }

    const walletToSave = {
      ...walletData,
      image: imageUploadResponse.data,
    };
    if (!walletData.id) {
      walletToSave.amount = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData.id
      ? doc(firestore, "wallets", walletData.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); // merge: true updates only the data provided

    return {
      success: true,
      data: { ...walletToSave, id: walletRef.id },
    };
  } catch (error: any) {
    console.error("Error creating or updating wallet:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};
