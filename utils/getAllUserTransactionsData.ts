import axios from "axios";
import checkIfSpedUpOrNewTx from "./checkIfSpedUpOrNewTx";
import createTxDictionary from "./createTxDictionary";
import getLocallySavedTransactions from "./getLocallySavedTransactions";

const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

const getAllUserTransactionsData = async (
  address: string,
  network: "mainnet" | "rinkeby"
): Promise<SpedUpResult> => {
  const txEndpoint = `${
    network === "mainnet" ? etherscanBaseURL : etherscanRinkebyBaseURL
  }?module=account&action=txlist&address=${address}&startblock=9000000&endblock=99999999&offset=25&sort=desc&apikey=${etherscanApiToken}`;

  const res: { data: EtherscanResponse } = await axios.get(txEndpoint);

  // Api data
  const rawApiTxs = res.data.result;
  console.log("API TXS", rawApiTxs);

  // Local data
  let localTxsDictionary = getLocallySavedTransactions(address);
  console.log("LOCAL TXS", localTxsDictionary);

  // Check for change
  if (localTxsDictionary !== null) {
    return checkIfSpedUpOrNewTx(localTxsDictionary, rawApiTxs, address);
  } else {
    // Create tx dictionary
    const newTxsDictionary = createTxDictionary(rawApiTxs, address);
    // Add to local dictionary
    localStorage.setItem(address, JSON.stringify(newTxsDictionary));
    console.log("NEW DICTIONARY", newTxsDictionary);
    return { status: "Same", txs: newTxsDictionary };
  }
};

export default getAllUserTransactionsData;

// CONSTS

const etherscanBaseURL = "https://api.etherscan.io/api";
const etherscanRinkebyBaseURL = "https://api-rinkeby.etherscan.io/api";

type Dictionary<T> = {
  [Key: string]: T;
};

type SpedUpResult = {
  status: "Diff" | "Same";
  txs: Dictionary<EtherscanTransactionResponse>;
};

type EtherscanResponse = {
  status: string;
  message: string;
  result: EtherscanTransactionResponse[];
};

type EtherscanTransactionResponse = {
  blockNumber: string;
  timestamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  speedUp?: boolean;
};
