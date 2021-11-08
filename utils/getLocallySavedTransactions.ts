const getLocallySavedTransactions = (userAddress: string) => {
  const localStringDictionary = localStorage.getItem(userAddress);
  if (localStringDictionary !== null) {
    const locallyStoredTxs: Dictionary<EtherscanTransactionResponse> =
      JSON.parse(localStringDictionary);
    console.log("Found local tx for:", userAddress);
    console.log("Here they are:", locallyStoredTxs);
    return locallyStoredTxs;
  }
  console.log("No local tx saved for:", userAddress);
  return null;
};

export default getLocallySavedTransactions;

type Dictionary<T> = {
  [Key: string]: T;
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
