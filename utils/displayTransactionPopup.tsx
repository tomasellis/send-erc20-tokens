import { toast } from "react-toastify";
import TransactionPopup from "../components/MainScreenComponents/AppComponents/TransactionPopup";
import getLocallySavedTransactions from "./getLocallySavedTransactions";
import { LocalTx } from "./types";

const displayTransactionPopup = (tx: LocalTx, userAddress: string) => {
  console.log("ID IS", `${tx.nonce}${tx.status}`);
  toast(<TransactionPopup tx={tx} />, {
    onClose: async () => {
      // Whenever the toast is close, and its either
      // a success or error state, remove the tx from local storage
      if (tx.status !== "Pending") {
        let localTxs = getLocallySavedTransactions(userAddress);
        delete localTxs[tx.nonce];
        localStorage.setItem(
          `localTxFrom${userAddress}`,
          JSON.stringify(localTxs)
        );
      }
    },
    // Save toast id to dynamically replace toasts
    toastId: `${tx.nonce}${tx.status}`,
  });
};

export default displayTransactionPopup;
