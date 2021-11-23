import { Dictionary, LocalTx } from "./types";

const saveTxLocally = (
  tx: LocalTx,
  userAddress: string
): Dictionary<LocalTx> => {
  const string = localStorage.getItem(`localTxFrom${userAddress}`);

  if (string !== null) {
    // Get old saved txs
    const userTxs: Dictionary<LocalTx> = JSON.parse(string);

    // Add new tx to local txs
    userTxs[tx.nonce] = tx;

    localStorage.setItem(`localTxFrom${userAddress}`, JSON.stringify(userTxs));
    return userTxs;
  } else {
    let newDictionaryOfTxs: Dictionary<LocalTx> = {};
    newDictionaryOfTxs[tx.nonce] = tx;
    localStorage.setItem(
      `localTxFrom${userAddress}`,
      JSON.stringify(newDictionaryOfTxs)
    );
    return newDictionaryOfTxs;
  }
};

export default saveTxLocally;
