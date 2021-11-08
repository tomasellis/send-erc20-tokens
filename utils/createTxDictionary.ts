const createTxDictionary = (
  rawApiData: EtherscanTransactionResponse[],
  userAddress: string
) => {
  let newDictionary: Dictionary<EtherscanTransactionResponse> = {};
  for (let i = 0; i < rawApiData.length; i++) {
    let apiTx = rawApiData[i];
    if (apiTx.from === userAddress) {
      apiTx.speedUp = false;
      newDictionary[apiTx.nonce] = apiTx;
    }
  }
  return newDictionary;
};

export default createTxDictionary;

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
  speedUp?: boolean;
};
