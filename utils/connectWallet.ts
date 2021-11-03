type ConnectWalletResponse = "NOMETAMASK" | "ERROR" | string;

const connectWallet = async (): Promise<ConnectWalletResponse> => {
  try {
    // @ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return "NOMETAMASK";
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Connected", accounts[0]);

    return accounts[0];
  } catch (error) {
    console.log(error);
    return "ERROR";
  }
};

export default connectWallet;