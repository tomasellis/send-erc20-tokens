import { getTokensBalance } from "@mycrypto/eth-scan";
import react, { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import connectWallet from "../utils/connectWallet";
import getTokenList from "../utils/getTokenList";
import TokenSelector from "./TokenSelector";
import { CircularProgress } from "@mui/material";
import updateTokensBalance from "../utils/updateTokensBalance";
import transferToken from "../utils/transferToken";
import getAllUserTransactionsData from "../utils/getAllUserTransactionsData";
import { useInterval } from "../utils/useInterval";
import { cp } from "fs/promises";

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
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
};

type SpedUpResult = {
  status: "Diff" | "Same";
  txs: Dictionary<EtherscanTransactionResponse>;
};

type Dictionary<T> = {
  [Key: string]: T;
};

const MainScreen = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<"mainnet" | "rinkeby">("rinkeby");
  const [tokenList, setTokenList] = useState<MappedToken[]>();
  const [selectedToken, setSelectedToken] = useState<MappedToken>({
    address: "",
    iconUrl: "",
    balance: 0,
    name: "NULL",
  });
  const [quantityToSend, setQuantityToSend] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [transactions, setTransactions] = useState<SpedUpResult>({
    status: "Same",
    txs: {},
  });

  let provider = new ethers.providers.JsonRpcProvider(
    "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
  );

  // Change provider when changing networks
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
        // Update transactions list whenever the user changes address
        const transactionsData = await getAllUserTransactionsData(
          userAddress,
          network
        );
        setTransactions({
          ...transactions,
          txs: transactionsData.txs,
          status: transactionsData.status,
        });

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

  // While gas changed, poll
  useEffect(() => {
    if (transactions.status === "Diff") {
      useInterval(async () => {
        console.log("Checking if gas same");
        const transactionsData = await getAllUserTransactionsData(
          userAddress,
          network
        );
        setTransactions({
          ...transactions,
          txs: transactionsData.txs,
          status: transactionsData.status,
        });
      }, 5);
    }
  }, [transactions.status]);

  return (
    <div
      id="MainScreen"
      className="w-full h-full flex-1 flex flex-col flex-nowrap items-center"
    >
      {/* Banner */}
      <div
        id="Banner"
        className="w-full h-auto flex justify-end bg-bannerPurple"
      >
        <button
          className="px-3 py-2 my-3 mr-3 rounded-xl text-accentPurple border-2 border-accentPurple hover:bg-accentPurple hover:text-bannerPurple"
          onClick={() => {
            const address = connectWallet();
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
          Connect wallet
        </button>
      </div>
      {/* Transfer UI */}
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div
          id="MainUI"
          style={{ borderRadius: "3px" }}
          className="border border-borderGrey w-2/5 h-5/6 px-9"
        >
          <span className="mt-10">Send an ERC20 token</span>

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
          <button
            onClick={async () => {
              const transactionsData = await getAllUserTransactionsData(
                userAddress,
                network
              );
              setTransactions({
                ...transactions,
                txs: transactionsData.txs,
                status: transactionsData.status,
              });
            }}
          >
            Check transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
