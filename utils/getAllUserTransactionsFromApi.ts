import axios from "axios";
import { LocalTx, Dictionary } from "./types";

const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

const getAllUserTransactionsFromApi = async (
  address: string,
  network: "Mainnet" | "Rinkeby"
): Promise<Dictionary<LocalTx>> => {
  const txEndpoint = `${
    network === "Mainnet" ? etherscanBaseURL : etherscanRinkebyBaseURL
  }?module=account&action=txlist&address=${address}&startblock=9000000&endblock=99999999&offset=25&sort=desc&apikey=${etherscanApiToken}`;

  let dictionary: Dictionary<LocalTx> = {};

  try {
    const res: { data: EtherscanResponse } = await axios.get(txEndpoint);

    // Api data
    const rawApiTxs = res.data.result;

    for (let i = 0; i < rawApiTxs.length; i++) {
      const tx = rawApiTxs[i];
      dictionary[tx.nonce] = {
        status: tx.txreceipt_status === "0" ? "Error" : "Success",
        changedQuantity: 0,
        gasLimit: parseInt(tx.gas),
        gasPrice: parseFloat(tx.gasPrice),
        hash: tx.hash,
        network: network,
        nonce: parseInt(tx.nonce),
        token: { address: "", balance: 0, iconUrl: "", name: "" },
        tokenQuantity: 0,
        to: tx.to,
      };
    }

    return dictionary;
  } catch (err) {
    console.log("getAllUserTransactionsDataError", err);
    return dictionary;
  }
};

export default getAllUserTransactionsFromApi;

// CONSTS

const etherscanBaseURL = "https://api.etherscan.io/api";
const etherscanRinkebyBaseURL = "https://api-rinkeby.etherscan.io/api";

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
};

/*

hash
nonce
from
to
txreceipt_status


*/
