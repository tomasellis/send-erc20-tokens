import { ConnectWalletResponse } from "./types";

const connectWallet = async (): Promise<ConnectWalletResponse> => {
  try {
    // @ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return {
        address: "NOMETAMASK",
        network: "ERROR",
      };
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const chainId = await ethereum.request({ method: "eth_chainId" });

    console.log("Chain", translateChain(chainId));
    console.log("Connected", accounts[0]);

    return {
      address: accounts[0],
      network: translateChain(chainId),
    };
  } catch (error) {
    console.log("Error while connecting wallet", error);
    return {
      address: "ERROR",
      network: "ERROR",
    };
  }
};

export default connectWallet;

const translateChain = (chainId: string) => {
  switch (chainId) {
    case "0x1":
      return "Mainnet";
    case "0x3":
      return "Ropsten";
    case "0x4":
      return "Rinkeby";
    case "0x5":
      return "Goerli";
    case "0x2a":
      return "Kovan";
    default:
      return "Rinkeby";
  }
};
