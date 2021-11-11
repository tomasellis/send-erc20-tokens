import { ethers, providers } from "ethers";

const checkForPastTransactions = (
  userAddress: string
): Dictionary<providers.TransactionResponse> | "" => {
  const stringTxs = localStorage.getItem(`pastTxFrom${userAddress}`);

  console.log("STRINGTXSCHECKFORPAST", stringTxs);
  const pastTxs: Dictionary<providers.TransactionResponse> | "" =
    stringTxs !== null ? JSON.parse(stringTxs) : "";

  if (pastTxs !== "") {
    console.log("DictionaryTxsPast", pastTxs);
    return pastTxs;
  } else {
    const localTxs: Dictionary<providers.TransactionResponse> = {};
    localStorage.setItem(`pastTxFrom${userAddress}`, JSON.stringify(localTxs));
    return "";
  }
};

export default checkForPastTransactions;

type Dictionary<T> = {
  [Key: string]: T;
};
