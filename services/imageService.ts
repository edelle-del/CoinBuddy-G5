import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { storage } from "@/config/firebase";
import { ResponseType } from "@/types";

export const uploadFile = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    if (typeof file === "string") {
      return {
        success: true,
        data: file,
      };
    }

    if (file && file.uri) {
      const response = await fetch(file.uri);
      const fileBlob = await response.blob();

      const fileName = file.uri.split("/").pop();
      const storageRef = ref(storage, `${folderName}/${fileName}`);

      await uploadBytesResumable(storageRef, fileBlob);

      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        data: downloadURL,
      };
    }

    return {
      success: false,
      msg: "Invalid file format",
    };
  } catch (error: any) {
    console.error("File upload failed:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getProfileImage = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object" && file.uri) return file.uri;

  return require("../assets/images/defaultAvatar.png");
};
export const getFilePath = (file: any) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object" && file.uri) return file.uri;
};
