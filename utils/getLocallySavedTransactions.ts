const checkLocallySavedTransactions = (address: string) => {
  const localString = localStorage.getItem(address);
  if (localString !== null) {
    const locallyStoredTx: EtherscanTransactionResponse[] =
      JSON.parse(localString);
    console.log("Found local tx for:", address);
    console.log("Here they are:", locallyStoredTx);
    return locallyStoredTx;
  }
  console.log("No local tx saved for:", address);
  return "";
};

export default checkLocallySavedTransactions;

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
