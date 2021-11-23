import { toast } from "react-toastify";
import TransactionPopup from "../components/TransactionPopup";
import getLocallySavedTransactions from "./getLocallySavedTransactions";
import { LocalTx } from "./types";

const displayTransactionPopup = (tx: LocalTx, userAddress: string) => {
  toast(<TransactionPopup tx={tx} />, {
    onClose: async () => {
      let localTxs = getLocallySavedTransactions(userAddress);
      delete localTxs[tx.nonce];
      localStorage.setItem(
        `localTxFrom${userAddress}`,
        JSON.stringify(localTxs)
      );
    },
  });
};

export default displayTransactionPopup;
