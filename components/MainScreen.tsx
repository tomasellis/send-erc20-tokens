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
      className="w-full h-full flex-1 flex flex-col flex-nowrap items-center"
    >
      {/* Banner */}
      <div
        id="Banner"
        className="w-full h-auto flex justify-end bg-bannerPurple"
      >
        <div className="w-full flex items-center self-center bg-yellow-300">
          <button>Send token</button>
          <button>Transaction History</button>
        </div>
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
            {userAddress.slice(userAddress.length - 4, userAddress.length)}
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
                const tx = await getTransferTokenTx(
                  receiverAddress,
                  network,
                  selectedToken,
                  quantityToSend
                );

                const updatedDictionary = saveTxLocally(tx, userAddress);

                // Update react state
                setTxsToWatch(updatedDictionary);
                setStillPending(true);
                // // Reset inputs
                // setSelectedToken({
                //   address: "",
                //   balance: 0,
                //   name: "",
                //   iconUrl: "",
                // });

                // setQuantityToSend("");
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
