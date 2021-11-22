import { ethers, providers } from "ethers";
import { LocalTx, MappedToken } from "./types";

export default async (
  receiverAddress: string,
  network: "Mainnet" | "Rinkeby",
  token: MappedToken,
  quantitySent: string
): Promise<LocalTx> => {
  // @ts-ignore
  const { ethereum } = window;

  // Get wallet
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  // Connect to the contract
  const contract = new ethers.Contract(token.address, erc20AbiFragment, signer);

  // How many tokens?
  const numberOfDecimals = 18;
  const numberOfTokens = ethers.utils.parseUnits(
    quantitySent,
    numberOfDecimals
  );

  // Send tokens
  try {
    const tx: providers.TransactionResponse = await contract.transfer(
      receiverAddress,
      numberOfTokens
    );

    const localTx: LocalTx = {
      changedQuantity: 0,
      closedToast: false,
      gasLimit: tx.gasLimit.toNumber(),
      gasPrice: tx.gasPrice?.toNumber() ?? 0,
      hash: tx.hash,
      network: network,
      nonce: tx.nonce,
      status: "Pending",
      to: tx.to ?? "",
      token: token,
      tokenQuantity: parseFloat(quantitySent),
    };

    return localTx;
  } catch (err) {
    console.log("getTransferTokenTxERROR", err);

    return {
      changedQuantity: 0,
      closedToast: false,
      gasLimit: 0,
      gasPrice: 0,
      hash: "ERROR",
      network: network,
      nonce: 0,
      status: "Pending",
      to: "ERROR",
      token: token,
      tokenQuantity: 0,
    };
  }
};

const erc20AbiFragment = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        type: "uint256",
        name: "_tokens",
      },
    ],
    constant: false,
    outputs: [],
    payable: false,
  },
];
