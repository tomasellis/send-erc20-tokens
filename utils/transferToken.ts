import { ethers } from "ethers";

export default async (
  receiverAddress: string,
  tokenAddress: string,
  quantitySent: string
) => {
  // @ts-ignore
  const { ethereum } = window;

  // Get wallet
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  // Connect to the contract
  const contract = new ethers.Contract(tokenAddress, erc20AbiFragment, signer);

  // Gas price
  const gasPrice = await signer.getGasPrice();
  console.log("GAS PRICE", gasPrice);

  // How many tokens?
  const numberOfDecimals = 18;
  const numberOfTokens = ethers.utils.parseUnits(
    quantitySent,
    numberOfDecimals
  );

  // Send tokens
  try {
    const tx = await contract.transfer(receiverAddress, numberOfTokens);
    console.log("Transaction incoming");
    await tx.wait();
    console.log("Transaction done!");
  } catch (err) {
    console.log("ERR TX", err);
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
