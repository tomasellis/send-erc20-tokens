export type LocalTx = {
  hash: string;
  nonce: number;
  tokenQuantity: number;
  token: MappedToken;
  changedQuantity: number;
  gasPrice: number;
  gasLimit: number;
  network: Network;
  status: TxStatus;
  to: string;
  canceled?: boolean;
  boosted?: boolean;
};

export type Network =
  | "Mainnet"
  | "Ropsten"
  | "Rinkeby"
  | "Goerli"
  | "Kovan"
  | "ERROR";

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

export type TxStatus = "Pending" | "Success" | "Cancelled" | "Error";

export type ConnectWalletResponse = {
  address: "NOMETAMASK" | "ERROR" | string;
  network: Network;
};
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
