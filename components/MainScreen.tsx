import react, { useEffect, useState } from "react";
import { BigNumber, ethers, providers, Transaction } from "ethers";
import connectWallet from "../utils/connectWallet";
import getTokenList from "../utils/getTokenList";
import TokenSelector from "./TokenSelector";
import { CircularProgress } from "@mui/material";
import updateTokensBalance from "../utils/updateTokensBalance";
import getAllUserTransactionsData from "../utils/getAllUserTransactionsData";
import { useInterval } from "../utils/useInterval";
import checkIfWalletIsConnected from "../utils/checkIfWalletIsConnected";
import { GlobeIcon } from "@heroicons/react/solid";
import getTransferTokenTx from "../utils/getTransferTokenTx";
import TransactionPopup from "./TransactionPopup";
import { toast, ToastContainer } from "react-toastify";
import checkForPastTransactions from "../utils/checkForPastTransactions";
import { isBigNumberish } from "@ethersproject/bignumber/lib/bignumber";

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
  const [network, setNetwork] = useState<"Mainnet" | "Rinkeby">("Rinkeby");
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

  const [updateTokensList, setUpdateTokensList] = useState<boolean>(false);

  let provider = new ethers.providers.JsonRpcProvider(
    "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
  );

  // Update tokens balance with user data
  useEffect(() => {
    if (updateTokensList === true) {
      (async () => {
        if (tokenList !== undefined) {
          const updatedTokensBalance = await updateTokensBalance(
            userAddress,
            tokenList,
            provider
          );
          setTokenList(updatedTokensBalance);
          setUpdateTokensList(false);
          console.log("UPDATED TOKENS BALANCE");
        }
      })();
    }
  }, [updateTokensList]);

  // Change provider when changing networks
  useEffect(() => {
    if (network === "Mainnet") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
      );
    }
    if (network === "Rinkeby") {
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
      // Check if user has connected before
      const account = await checkIfWalletIsConnected();
      if (account !== "") {
        setUserAddress(account);
      }
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

        // Same with tokens balance
        const updatedTokensBalance = await updateTokensBalance(
          userAddress,
          tokenList,
          provider
        );
        setTokenList(updatedTokensBalance);
      })();
    }
  }, [userAddress]);

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
        {userAddress === "" ? (
          <button
            className="px-3 py-1 my-2 mr-3 rounded-xl text-accentPurple border-2 border-accentPurple hover:bg-accentPurple hover:text-bannerPurple"
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
            Connect wallet
          </button>
        ) : (
          <div
            onClick={async () => {
              // @ts-ignore
              const { ethereum } = window;
              try {
                await ethereum.request({
                  method: "wallet_requestPermissions",
                  params: [
                    {
                      eth_accounts: {},
                    },
                  ],
                });
                const address = await ethereum.request({
                  method: "eth_requestAccounts",
                  params: [
                    {
                      eth_accounts: {},
                    },
                  ],
                });
                console.log("WALLET", address[0]);
                setUserAddress(address[0]);
              } catch (err) {
                alert("Please check your wallet");
                console.log("ALREADY CONNECTED WALLET", err);
              }
            }}
            className="flex px-3 py-1 my-2 mr-3 rounded-xl text-accentPurple  border-accentPurple bg-lightPurple hover:bg-accentPurple hover:text-bannerPurple cursor-pointer"
          >
            <GlobeIcon width="20px" color="lightgreen" />
            &#160;
            <b>{network}</b>
            &#160;
            {userAddress.slice(0, 10)}...
            {userAddress.slice(userAddress.length - 5, userAddress.length - 1)}
          </div>
        )}
      </div>
      {/* Transfer UI */}
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div
          id="MainBox"
          style={{
            borderRadius: "3px",
            width: "436px",
            height: "500px",
          }}
          className="border border-borderGrey px-9 flex flex-col items-center font-sans"
        >
          <span className="text-2xl text-textGrey pt-5">
            Send an ERC20 token
          </span>
          <hr
            style={{
              borderTop: "1px solid #999999",
              width: "95%",
              height: "0px",
            }}
          />
          <span className="text-lg pt-3 text-textGrey">Select a token</span>
          <span className="text-lg pt-3 text-textGrey">How much to send?</span>
          <div className="flex flex-col">
            <input
              onChange={(e) => {
                const numberValue = parseFloat(e.target.value);
                if (isNaN(numberValue)) return setQuantityToSend("");
                numberValue >= 0
                  ? numberValue <= selectedToken.balance
                    ? setQuantityToSend(e.target.value)
                    : setQuantityToSend(selectedToken.balance.toString())
                  : setQuantityToSend("");
              }}
              placeholder="0"
              value={quantityToSend}
              style={{ maxWidth: "150px", borderRadius: "3px" }}
              className="border border-borderGrey py-5 mt-2 font-sans text-center text-3xl "
            />
            <div
              onClick={() =>
                setQuantityToSend(selectedToken.balance.toString())
              }
              style={{
                zIndex: 999,
                width: "fit-content",
                top: "-25px",
                left: "105px",
              }}
              className="relative text-lightBlue z-50 hover:text-pink-600 cursor-pointer"
            >
              <span className="font-bold">MAX</span>
            </div>
          </div>
          <span className="text-lg text-textGrey">
            Input the address of the receiver
          </span>
          <input
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder={"Type here..."}
            style={{ minWidth: "350px", height: "30px", borderRadius: "3px" }}
            className="border border-borderGrey py-5 mt-2 font-sans text-center text-sm"
          />
          <div className="flex-1 flex flex-col justify-center items-center">
            <button
              style={{ borderRadius: "3px" }}
              className="w-72 h-16 font-sans text-3xl font-bold text-accentPurple bg-lightBlue"
              onClick={async () => {
                console.log("Starting transfer");
                try {
                  const tx = await getTransferTokenTx(
                    receiverAddress,
                    selectedToken.address,
                    quantityToSend
                  );
                  toast(
                    <TransactionPopup
                      tx={tx}
                      quantitySent={quantityToSend}
                      selectedToken={selectedToken}
                      network={network}
                      setUpdateTokensList={setUpdateTokensList}
                    />
                  );

                  if (tokenList !== undefined) {
                    const updatedTokensBalance = await updateTokensBalance(
                      userAddress,
                      tokenList,
                      provider
                    );
                    // Reset inputs
                    setTokenList(updatedTokensBalance);
                    setSelectedToken({
                      address: "",
                      balance: 0,
                      name: "",
                      iconUrl: "",
                    });
                    setQuantityToSend("");
                    console.log("Finished transfer");
                  }
                } catch (err: any) {
                  if (err["transaction"] !== undefined) {
                    const errTyped = err as TxCallException;
                    console.log(
                      "EXCEPTION",
                      errTyped.receipt,
                      errTyped.transaction,
                      errTyped.transactionHash
                    );
                  } else {
                    const errTyped = err as TxTransactionReplaced;
                    console.log(
                      "REPLACED",
                      errTyped.cancelled,
                      errTyped.reason,
                      errTyped.replacement,
                      errTyped.receipt
                    );
                  }
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;

type TxCallException = {
  transaction: Transaction;
  transactionHash: string;
  receipt: EtherscanTransactionResponse;
};

type TxTransactionReplaced = {
  hash: string;
  reason: string;
  cancelled: boolean;
  replacement: providers.TransactionResponse;
  receipt: providers.TransactionReceipt;
};
