import axios from "axios";
import checkIfSpedUpTx from "./checkIfSpedUpTx";
import checkLocallySavedTransactions from "./getLocallySavedTransactions";

const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

const getAllUserTransactionsData = async (
  address: string,
  network: "mainnet" | "rinkeby"
): Promise<SpedUpResult> => {
  console.log("TOKEN", etherscanApiToken);

  const txEndpoint = `${
    network === "mainnet" ? etherscanBaseURL : etherscanRinkebyBaseURL
  }?module=account&action=txlist&address=${address}&startblock=9000000&endblock=99999999&offset=10&page=1&sort=desc&apikey=${etherscanApiToken}`;

  const res: { data: EtherscanResponse } = await axios.get(txEndpoint);

  console.log("RES DATA", res.data);

  // Transactions from api
  const apiTxs: EtherscanTransactionResponse[] = res.data.result.map((tx) => {
    return { ...tx, speedUp: false };
  });

  // Locally saved tx
  const localTxs = checkLocallySavedTransactions(address);
  console.log("LOCAL TXS IN GE ALL", localTxs);

  if (localTxs === "") {
    // There's nothing saved locally
    // Save the api response
    localStorage.setItem(address, JSON.stringify(apiTxs));
    return { status: "Same", txs: apiTxs };
  } else {
    // Check if something changed
    const spedUpResult = checkIfSpedUpTx(localTxs, apiTxs);
    if (spedUpResult.status === "ChangedGas")
      localStorage.setItem(address, JSON.stringify(spedUpResult.txs));
    console.log("Checking if some tx changed:", spedUpResult.status);
    return spedUpResult;
  }
};

export default getAllUserTransactionsData;

// CONSTS

const etherscanBaseURL = "https://api.etherscan.io/api";
const etherscanRinkebyBaseURL = "https://api-rinkeby.etherscan.io/api";

type SpedUpResult = {
  status: "ChangedGas" | "Same";
  txs: EtherscanTransactionResponse[];
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
