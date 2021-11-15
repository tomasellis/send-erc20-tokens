import { ethers, providers } from "ethers";

const checkForPastTransactions = (
  userAddress: string
): Dictionary<LocalTx | null> => {
  const stringTxs = localStorage.getItem(`pastTxFrom${userAddress}`);

  console.log("STRINGTXSCHECKFORPAST", stringTxs);
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

type Dictionary<T> = {
  [Key: string]: T;
};

type LocalTx = {
  hash: string;
  nonce: number;
  imageUrl: string;
  tokenName: string;
  quantitySent: number;
  status: "Success" | "Error" | "Speed" | "Pending";
};
