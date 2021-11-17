import { ethers } from "ethers";

const saveTxLocally = (
  tx: ethers.providers.TransactionResponse,
  userAddress: string,
  tokenSent: MappedToken,
  tokenQuantitySent: number,
  currentNetwork: "Mainnet" | "Rinkeby"
) => {
  const string = localStorage.getItem(`localTxFrom${userAddress}`);

  if (string !== null) {
    // Get old saved txs
    const userTxs: Dictionary<LocalTx> = JSON.parse(string);

    const newTx: LocalTx = {
      hash: tx.hash,
      nonce: tx.nonce,
      token: tokenSent,
      tokenQuantity: tokenQuantitySent,
      changedQuantity: 0,
      network: currentNetwork,
      gasLimit: tx.gasLimit !== undefined ? tx.gasLimit.toNumber() : 0,
      gasPrice: tx.gasPrice !== undefined ? tx.gasPrice.toNumber() : 0,
    };

    // Add new tx to local txs
    userTxs[newTx.nonce] = newTx;

    localStorage.setItem(`localTxFrom${userAddress}`, JSON.stringify(userTxs));
  } else {
    // Setup for later use
    localStorage.setItem(`localTxFrom${userAddress}`, JSON.stringify({}));
  }
};

export default saveTxLocally;

type LocalTx = {
  hash: string;
  nonce: number;
  tokenQuantity: number;
  token: MappedToken;
  changedQuantity: number;
  gasPrice: number;
  gasLimit: number;
  network: "Mainnet" | "Rinkeby";
};

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

type Dictionary<T> = {
  [Key: string]: T;
};
