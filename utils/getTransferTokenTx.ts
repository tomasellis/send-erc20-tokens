import { ethers, providers } from "ethers";

export default async (
  receiverAddress: string,
  tokenAddress: string,
  quantitySent: string
): Promise<providers.TransactionResponse> => {
  // @ts-ignore
  const { ethereum } = window;

  // Get wallet
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  // Connect to the contract
  const contract = new ethers.Contract(tokenAddress, erc20AbiFragment, signer);

  // How many tokens?
  const numberOfDecimals = 18;
  const numberOfTokens = ethers.utils.parseUnits(
    quantitySent,
    numberOfDecimals
  );

  // Send tokens
  const tx: providers.TransactionResponse = await contract.transfer(
    receiverAddress,
    numberOfTokens
  );
  return tx;
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
