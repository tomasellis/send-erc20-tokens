export type LocalTx = {
  hash: string;
  nonce: number;
  tokenQuantity: number;
  token: MappedToken;
  changedQuantity: number;
  gasPrice: number;
  gasLimit: number;
  network: "Mainnet" | "Rinkeby";
  status: TxStatus;
  to: string;
};

export type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

export type Dictionary<T> = {
  [Key: string]: T;
};

export type EtherscanTransactionResponse = {
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

export type TxStatus = "Pending" | "Success" | "Error";

// type TxCallException = {
//   transaction: Transaction;
//   transactionHash: string;
//   receipt: providers.TransactionResponse;
// };

// type TxTransactionReplaced = {
//   hash: string;
//   reason: string;
//   cancelled: boolean;
//   replacement: providers.TransactionResponse;
//   receipt: providers.TransactionReceipt;
// };
