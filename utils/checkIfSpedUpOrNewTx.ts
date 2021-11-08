const checkIfSpedUpOrNewTx = (
  localTxsDictionary: Dictionary<EtherscanTransactionResponse>,
  rawApiTxs: EtherscanTransactionResponse[],
  userAddress: string
): SpedUpResult => {
  // Nothing changed yet
  let flag = false;

  for (let i = 0; i < rawApiTxs.length; i++) {
    let apiTx = rawApiTxs[i];
    // First, check dictionary to see if the tx is new
    if (localTxsDictionary[apiTx.nonce] === undefined) {
      // Then, if theres a new tx, save it to dictionary
      if (apiTx.from === userAddress) {
        localTxsDictionary[apiTx.nonce] = apiTx;
      }
    } else {
      // If there's something with the same nonce
      let localTx = localTxsDictionary[apiTx.nonce];
      // Compare gas price difference between localTx and apiTx
      if (localTx.gasPrice !== apiTx.gasPrice) {
        console.log("DIFF TX:", localTx, "vs", apiTx);
        apiTx.speedUp = true;
        localTxsDictionary[apiTx.nonce] = apiTx;
        flag = true;
      }
    }
  }

  if (flag === false) return { status: "Same", txs: localTxsDictionary };
  else
    return {
      status: "Diff",
      txs: localTxsDictionary,
    };
};

export default checkIfSpedUpOrNewTx;

type Dictionary<T> = {
  [Key: string]: T;
};

type SpedUpResult = {
  status: "Diff" | "Same";
  txs: Dictionary<EtherscanTransactionResponse>;
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
