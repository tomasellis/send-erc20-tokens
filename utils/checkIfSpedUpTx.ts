const checkIfSpedUpTx = (
  localTxs: EtherscanTransactionResponse[],
  apiTxs: EtherscanTransactionResponse[]
): SpedUpResult => {
  // Nothing changed yet
  let flag = false;
  // DEV FIX: we need to update cached data
  // Theres something saved
  // const updatedGasTx = apiTxs.map((apiTx, index) => {
  //   // Check if gasPrice was updated since last local save
  //   for (let i = 0; i < apiTxs.length; i++) {
  //     if (apiTx.hash === localTxs[i].hash) {
  //       if (apiTx.gasPrice !== localTxs[i].gasPrice) {
  //         apiTx.speedUp = true;
  //         flag = true;
  //         break;
  //       }
  //     }
  //   }
  //   return apiTx;
  // });

  if (flag === false) return { status: "Same", txs: apiTxs };
  else
    return {
      status: "ChangedGas",
      txs: apiTxs,
    };
};

export default checkIfSpedUpTx;

type SpedUpResult = {
  status: "ChangedGas" | "Same";
  txs: EtherscanTransactionResponse[];
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
