import react, { useEffect, useState } from "react";
import { ethers, providers, Transaction } from "ethers";
import connectWallet from "../utils/connectWallet";
import getTokenList from "../utils/getTokenList";
import updateTokensBalance from "../utils/updateTokensBalance";
import getAllUserTransactionsFromApi from "../utils/getAllUserTransactionsFromApi";
import checkIfWalletIsConnected from "../utils/checkIfWalletIsConnected";
import { GlobeIcon } from "@heroicons/react/solid";
import getTransferTokenTx from "../utils/getTransferTokenTx";
import { LocalTx, Dictionary, MappedToken } from "../utils/types";
import displayTransactionPopup from "../utils/displayTransactionPopup";
import getLocallySavedTransactions from "../utils/getLocallySavedTransactions";
import { useInterval } from "../utils/useInterval";
import getDifferencesBetweenApiAndLocalTxs from "../utils/getDifferencesBetweenApiAndLocalTxs";
import saveTxLocally from "../utils/saveTxLocally";
import { shallowCopy } from "@ethersproject/properties";
import { toast } from "react-toastify";

const MainScreen = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<"Mainnet" | "Rinkeby">("Rinkeby");
  const [tokenList, setTokenList] = useState<MappedToken[]>();
  const [selectedToken, setSelectedToken] = useState<MappedToken>({
    address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    iconUrl: "",
    balance: 0,
    name: "DAIDEV",
  });
  const [quantityToSend, setQuantityToSend] = useState<string>("1");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [updateTokensList, setUpdateTokensList] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>(
    new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
    )
  );
  const [txsToWatch, setTxsToWatch] = useState<Dictionary<LocalTx> | null>(
    null
  );
  const [stillPending, setStillPending] = useState<boolean>(true);
  const [txOnDisplay, setTxOnDisplay] = useState<
    Dictionary<"Pending" | "Done">
  >({});

  // Change provider when changing networks
  useEffect(() => {
    if (network === "Mainnet") {
      return setProvider(
        new ethers.providers.JsonRpcProvider(
          "https://mainnet.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
        )
      );
    }
    return setProvider(
      new ethers.providers.JsonRpcProvider(
        "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
      )
    );
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
        // Update tokens balance
        const updatedTokensBalance = await updateTokensBalance(
          userAddress,
          tokenList,
          provider
        );
        setTokenList(updatedTokensBalance);

        // Get local transactions
        const dictOfLocalTxs = getLocallySavedTransactions(userAddress);
        setTxsToWatch(dictOfLocalTxs);
      })();
    }
  }, [userAddress]);

  // Everytime localTxs change, display them properly
  useEffect(() => {
    if (txsToWatch !== null) {
      let txsOnDisplayCopy = { ...txOnDisplay };
      for (let nonce in txsToWatch) {
        console.log("We displaying toasts now ======>");
        let tx = txsToWatch[nonce];
        // Now displaying toasts
        // If still haven't displayed this tx
        if (txsOnDisplayCopy[nonce] === undefined) {
          displayTransactionPopup(tx, userAddress);
          txsOnDisplayCopy[nonce] =
            tx.status === "Pending" ? "Pending" : "Done";
        }
        // If already displayed tx while it was pending, and the status changed
        if (txsOnDisplayCopy[nonce] === "Pending" && tx.status !== "Pending") {
          toast.dismiss(`${tx.nonce}Pending`);
          displayTransactionPopup(tx, userAddress);
          txsOnDisplayCopy[nonce] = "Done";
        }
      }
      setTxOnDisplay(txsOnDisplayCopy);
    }
  }, [txsToWatch]);

  // Pool txs whenever there's a tx still pending
  useInterval(
    async () => {
      console.log("Still pending tx, now pooling...");
      // Get txs from API
      const txApiDictionary = await getAllUserTransactionsFromApi(
        userAddress,
        network
      );

      // Compare local txs status with api txs
      const diff = getDifferencesBetweenApiAndLocalTxs(
        txApiDictionary,
        txsToWatch
      );

      if (typeof diff === "string") {
        // If nothing changed, keep pooling data
        // If no tx is pending, stop pooling
        diff === "KeepPooling" ? setStillPending(true) : setStillPending(false);
        const shallowCopy = { ...txsToWatch };
        setTxsToWatch(shallowCopy);
      } else {
        // If something changed, update react state to get the machinery rolling
        let shallowCopy = { ...txsToWatch };
        for (let nonce in diff) {
          let diffTx = diff[nonce];
          shallowCopy[nonce] = diffTx;
        }
        setTxsToWatch(shallowCopy);

        localStorage.setItem(
          `localTxFrom${userAddress}`,
          JSON.stringify(shallowCopy)
        );
      }
    },
    stillPending === true ? 10000 : undefined
  );

  return (
    <div
      id="MainScreen"
      className="w-full h-full flex-1 flex flex-row flex-nowrap justify-center items-center"
    >
      <div className="w-1/2 h-full flex-1 flex flex-col justify-center items-center">
        <span className="bg-pink-500 text-lightPurple text-5xl w-3/4 pl-20 pb-16">
          Send any curated ERC20 token.
        </span>
        <button
          className="bg-lightPurple text-accentPurple px-3 py-2 text-3xl font-light rounded-full"
          onClick={async () => await connectWallet()}
        >
          Connect Wallet
        </button>
      </div>
      <div className="w-1/2 h-full flex-1 flex justify-center items-center">
        Screen right
      </div>
    </div>
  );
};

export default MainScreen;
