import { Dictionary, LocalTx } from "./types";

const getLocallySavedTransactions = (
  userAddress: string
): Dictionary<LocalTx> => {
  const stringTxs = localStorage.getItem(`localTxFrom${userAddress}`);

  const pastTxs: Dictionary<LocalTx> | "" =
    stringTxs !== null ? JSON.parse(stringTxs) : "";

  if (pastTxs !== "") {
    return pastTxs;
  } else {
    const localTxs: Dictionary<LocalTx> = {};
    localStorage.setItem(`localTxFrom${userAddress}`, JSON.stringify(localTxs));
    return localTxs;
  }
};

export default getLocallySavedTransactions;
