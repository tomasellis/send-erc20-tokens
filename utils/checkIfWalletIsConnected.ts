const checkIfWalletIsConnected = async (): Promise<string> => {
  // @ts-ignore
  const { ethereum } = window;

  if (ethereum) {
    console.log("Make sure you have metamask!");

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log("ACCOUNTS", accounts);
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    }

    return "";
  } else {
    window.alert("Please install Metamask to get the full experience");
    return "";
  }
};

export default checkIfWalletIsConnected;
