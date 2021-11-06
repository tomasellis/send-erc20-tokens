import { getTokensBalance } from "@mycrypto/eth-scan";
import react, { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import connectWallet from "../utils/connectWallet";
import getTokenList from "../utils/getTokenList";
import TokenSelector from "./TokenSelector";
import { CircularProgress } from "@mui/material";
import updateTokensBalance from "../utils/updateTokensBalance";
import transferToken from "../utils/transferToken";
import getUserTransactions from "../utils/getUserTransactions";

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

const MainScreen = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<"mainnet" | "rinkeby">("rinkeby");
  const [tokenList, setTokenList] = useState<MappedToken[]>();
  const [quantityToSend, setQuantityToSend] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<MappedToken>({
    address: "",
    iconUrl: "",
    balance: 0,
    name: "NULL",
  });

  let provider = new ethers.providers.JsonRpcProvider(
    "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
  );

  useEffect(() => {
    if (network === "mainnet") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
      );
    }
    if (network === "rinkeby") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
      );
    }
  }, [network]);

  // Load page, load tokens
  useEffect(() => {
    (async () => {
      const tokenList = await getTokenList(network);
      setTokenList(tokenList);
    })();
  }, []);

  // After getting tokens, and if user wallet connected, load balances
  useEffect(() => {
    if (userAddress !== "" && tokenList !== undefined) {
      (async () => {
        await getUserTransactions(userAddress);
        const updatedTokensBalance = await updateTokensBalance(
          userAddress,
          tokenList,
          provider
        );
        console.log(updatedTokensBalance);
        setTokenList(updatedTokensBalance);
      })();
    }
  }, [userAddress]);

  return (
    <div className="w-60 h-96 rounded-md border border-red-500 flex flex-col">
      {`Send a token on the ${network} network`}
      <button
        onClick={async () => {
          const address = await connectWallet();
          switch (address) {
            case "ERROR":
              return alert("Error while connecting wallet");
            case "NOMETAMASK":
              return alert("Please install metamask");
            default:
              return setUserAddress(address);
          }
        }}
      >
        Connect your wallet!
      </button>
      <div>
        <input
          type="radio"
          id="Rinkebty"
          name="Rinkeby"
          value="rinkeby"
          checked={network === "rinkeby"}
          onChange={(e) => setNetwork("rinkeby")}
        />
        <label>Rinkeby</label>
      </div>

      <div>
        <input
          type="radio"
          id="Mainnet"
          name="Mainnet"
          value="mainnet"
          checked={network === "mainnet"}
          onChange={(e) => setNetwork("mainnet")}
        />
        <label>Mainnet</label>
      </div>
      <input
        onChange={(e) => setReceiverAddress(e.target.value)}
        placeholder="Please input the address you are gifting to!"
      />
      {userAddress !== "" ? `The user address is: ${userAddress}` : ""}
      {tokenList !== undefined ? (
        <TokenSelector
          options={tokenList}
          setSelectedToken={setSelectedToken}
        />
      ) : (
        <CircularProgress color="inherit" size={30} />
      )}
      <hr />
      <input
        placeholder={"How many tokens to send?"}
        onChange={(e) => setQuantityToSend(e.target.value)}
      />
      <button
        onClick={async () => {
          console.log("Starting transfer");
          await transferToken(
            receiverAddress,
            selectedToken.address,
            quantityToSend
          );
          console.log("Finished transfer");
          if (tokenList !== undefined) {
            const updatedTokensBalance = await updateTokensBalance(
              userAddress,
              tokenList,
              provider
            );
            setTokenList(updatedTokensBalance);
          }
        }}
      >
        Transfer
      </button>
    </div>
  );
};

export default MainScreen;
