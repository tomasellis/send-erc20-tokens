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
  const [currentQueuedTx, setCurrentQueuedTx] =
    useState<ethers.providers.TransactionResponse>();
  const [updateTokensList, setUpdateTokensList] = useState<boolean>(false);

  let provider = new ethers.providers.JsonRpcProvider(
    "https://rinkeby.infura.io/v3/927415a05250482eaee7eda6db84bd5e"
  );

  // Update tokens
  useEffect(() => {
    if (updateTokensList === true) {
      (async () => {
        if (tokenList !== undefined) {
          const updatedTokensBalance = await updateTokensBalance(
            userAddress,
            tokenList,
            provider
          );
          // Reset inputs
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

  // Load page, load tokens, load past transactions
  useEffect(() => {
    (async () => {
      const tokenList = await getTokenList(network);
      setTokenList(tokenList);
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
        const pastTxs = checkForPastTransactions(userAddress);
        console.log("PASTTXSEFFECT", pastTxs);
        if (pastTxs !== "") {
          for (let key in pastTxs) {
            const currentTx = pastTxs[key];
            const properParsedTx: providers.TransactionResponse = {
              ...currentTx,
              accessList: currentTx.accessList,
              blockHash: currentTx.blockHash,
              blockNumber: currentTx.blockNumber,
              chainId: currentTx.chainId,
              confirmations: currentTx.confirmations,
              data: currentTx.data,
              from: currentTx.from,
              gasLimit: BigNumber.from(currentTx.gasLimit),
              gasPrice: BigNumber.from(currentTx.gasPrice),
              hash: currentTx.hash,
              maxFeePerGas: BigNumber.from(currentTx.maxFeePerGas),
              maxPriorityFeePerGas: BigNumber.from(
                currentTx.maxPriorityFeePerGas
              ),
              nonce: currentTx.nonce,
              r: currentTx.r,
              s: currentTx.s,
              to: currentTx.to,
              type: currentTx.type,
              v: currentTx.v,
              value: BigNumber.from(currentTx.value),
            };
            toast(
              <TransactionPopup
                tx={properParsedTx}
                quantitySent={quantityToSend}
                selectedToken={selectedToken}
                network={network}
                setUpdateTokensList={setUpdateTokensList}
              />,
              {
                onClose: () => {
                  const pastTxs = checkForPastTransactions(userAddress);
                  if (pastTxs !== "") {
                    alert(`Borra ${pastTxs[key].nonce} y ${pastTxs[key].hash}`);
                  }
                },
              }
            );
          }
        }
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
          <div className="pt-2">
            {tokenList !== undefined ? (
              <TokenSelector
                tx={currentQueuedTx ? currentQueuedTx.hash : ""}
                selectedToken={selectedToken}
                options={tokenList}
                setSelectedToken={setSelectedToken}
              />
            ) : (
              <CircularProgress color="inherit" size={30} />
            )}
          </div>
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
                  console.log("INCOMINGTX ========>", tx);
                  setCurrentQueuedTx(tx);
                  toast(
                    <TransactionPopup
                      tx={tx}
                      quantitySent={quantityToSend}
                      selectedToken={selectedToken}
                      network={network}
                      setUpdateTokensList={setUpdateTokensList}
                    />
                  );
                  // Save txs till user deletes them
                  const pastTxs = checkForPastTransactions(userAddress);
                  if (pastTxs !== "") {
                    pastTxs[tx.hash] = tx;
                    console.log("SAVING", pastTxs[tx.hash]);
                    localStorage.setItem(
                      `pastTxFrom${userAddress}`,
                      JSON.stringify(tx)
                    );
                  }
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
            <button
              onClick={() => {
                if (currentQueuedTx !== undefined) {
                  toast(
                    <TransactionPopup
                      tx={currentQueuedTx}
                      quantitySent={quantityToSend}
                      selectedToken={selectedToken}
                      network={network}
                      setUpdateTokensList={setUpdateTokensList}
                    />
                  );
                }
              }}
            >
              TOAST
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

// DEV FIX

const testTx = {
  blockHash:
    "0xd07a3debed70cdec4466b515cb47d457357d15054d6b7707c05a6a2c5d56b948",
  blockNumber: "9380309",
  confirmations: "227523",
  contractAddress: "0x23acd5d5ad2d9e714f2aab5f52daea5e5381c28b",
  cumulativeGasUsed: "2767880",
  from: "0x1d36e187203c4187adeb595c8a4219c4d2d66826",
  gas: "474808",
  gasPrice: "1000000010",
  gasUsed: "474808",
  hash: "0x30096f6dc492b404a53f2ac16adddd11218fac4d574dd214ca70a3d44757ffb5",
  input:
    "0x608060405234801561001057600080fd5b506100596040518060400160405280600981526020017f426565672077617665000000000000000000000000000000000000000000000081525061005e60201b6102971760201c565b6101e1565b6100fa81604051602401610072919061015f565b6040516020818303038152906040527f41304fac000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506100fd60201b60201c565b50565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b600061013182610181565b61013b818561018c565b935061014b81856020860161019d565b610154816101d0565b840191505092915050565b600060208201905081810360008301526101798184610126565b905092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156101bb5780820151818401526020810190506101a0565b838111156101ca576000848401525b50505050565b6000601f19601f8301169050919050565b61077d806101f06000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636fe15b441461003b5780639a2cdc0814610045575b600080fd5b610043610063565b005b61004d61024c565b60405161005a919061056a565b60405180910390f35b600160008082825461007591906105a1565b925050819055506001339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060005b600180549050811015610249576001808054905061010091906105f7565b8114156101925761018d604051806060016040528060248152602001610724602491396001838154811061015d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610330565b610236565b6102356040518060400160405280600781526020017f537570272025730000000000000000000000000000000000000000000000000081525060018381548110610205577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16610330565b5b80806102419061069a565b9150506100e2565b50565b600061028f6040518060400160405280601781526020017f5765206861766520256420746f74616c207761766573210000000000000000008152506000546103cc565b600054905090565b61032d816040516024016102ab91906104e8565b6040516020818303038152906040527f41304fac000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610468565b50565b6103c8828260405160240161034692919061050a565b6040516020818303038152906040527f319af333000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610468565b5050565b61046482826040516024016103e292919061053a565b6040516020818303038152906040527f9710a9d0000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610468565b5050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b61049a8161062b565b82525050565b60006104ab82610585565b6104b58185610590565b93506104c5818560208601610667565b6104ce81610712565b840191505092915050565b6104e28161065d565b82525050565b6000602082019050818103600083015261050281846104a0565b905092915050565b6000604082019050818103600083015261052481856104a0565b90506105336020830184610491565b9392505050565b6000604082019050818103600083015261055481856104a0565b905061056360208301846104d9565b9392505050565b600060208201905061057f60008301846104d9565b92915050565b600081519050919050565b600082825260208201905092915050565b60006105ac8261065d565b91506105b78361065d565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156105ec576105eb6106e3565b5b828201905092915050565b60006106028261065d565b915061060d8361065d565b9250828210156106205761061f6106e3565b5b828203905092915050565b60006106368261063d565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b8381101561068557808201518184015260208101905061066a565b83811115610694576000848401525b50505050565b60006106a58261065d565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156106d8576106d76106e3565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000601f19601f830116905091905056fe57656c636f6d6520746f2074686520636f6f6c2070656f706c6520636c75622c20257321a26469706673582212204a04c54c840ac650ae35dab913ec463c1615c42cbb3df44de89388360cda064464736f6c63430008000033",
  isError: "0",
  nonce: "0",
  speedUp: false,
  timeStamp: "1632961816",
  to: "0x1d36e187203c4187adeb54789a4219c4d2d66826",
  transactionIndex: "17",
  txreceipt_status: "1",
  value: "0",
};
