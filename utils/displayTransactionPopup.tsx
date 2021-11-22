import { toast } from "react-toastify";
import TransactionPopup from "../components/TransactionPopup";
import { LocalTx } from "./types";

const displayTransactionPopup = (tx: LocalTx) => {
  toast(<TransactionPopup tx={tx} />, {
    onClose: async () => {
      alert(`Cloooooosing N°${tx.nonce}`);
    },
  });
};

export default displayTransactionPopup;
