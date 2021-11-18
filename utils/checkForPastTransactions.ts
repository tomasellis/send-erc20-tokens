import { Dictionary, LocalTx } from "./types";

const checkForPastTransactions = (
  userAddress: string
): Dictionary<LocalTx | null> => {
  const stringTxs = localStorage.getItem(`pastTxFrom${userAddress}`);

  const pastTxs: Dictionary<LocalTx> | "" =
    stringTxs !== null ? JSON.parse(stringTxs) : "";

  if (pastTxs !== "") {
    return pastTxs;
  } else {
    const localTxs: Dictionary<LocalTx> = {};
    localStorage.setItem(`pastTxFrom${userAddress}`, JSON.stringify(localTxs));
    return localTxs;
  }
};

export default checkForPastTransactions;
