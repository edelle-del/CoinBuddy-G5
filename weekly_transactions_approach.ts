import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./config/firebase";
import { scale } from "./utils/styling";
import { colors } from "./constants/theme";

// Function to fetch and format weekly transaction data for the bar chart
