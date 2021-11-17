import { ethers, providers } from "ethers";
import react, { useEffect, useState } from "react";
import { ToastProps } from "react-toastify/dist/types";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { Icon } from "@mui/material";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import { toast } from "react-toastify";
import { Transaction } from "ethers";

const TransactionPopup = ({ tx }: { tx: LocalTx }) => {
  const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

  const baseEtherscanUrl =
    tx.network === "Mainnet" ? `etherscan.io` : `rinkeby.etherscan.io`;

  const etherscanUrl = `https://${baseEtherscanUrl}/tx/${tx.hash}`;

  const timeEstimationUrl = `https://api.${baseEtherscanUrl}/api?module=gastracker&action=gasestimate&gasprice=${
    tx.gasLimit.toNumber() * tx.gasPrice.toNumber()
  }&apikey=${etherscanApiToken}`;

  const [status, setStatus] = useState<TxStatus>("Mining");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(timeEstimationUrl);
      const seconds = data.result;
      setTime(seconds);
      if (tx.wait === undefined) {
        // @ts-ignore
        const { ethereum } = window;

        // Get wallet
        const provider = new ethers.providers.Web3Provider(ethereum);

        try {
          const txResult = await provider.waitForTransaction(tx.hash);
          console.log("PROPER TXRESULT", txResult);
        } catch (err) {
          console.error("TRY TXRESULT", err);
        }
      } else {
        await tx
          .wait()
          .then((value: any) => {
            console.log("TX VALUE DONE?", value);
            setStatus("Success");
            setUpdateTokensList(true);
          })
          .catch((err) => {
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
              if (errTyped.reason === "repriced") {
                setStatus("Speed");
                toast(
                  <TransactionPopup
                    tx={errTyped.replacement}
                    quantitySent={quantitySent}
                    selectedToken={selectedToken}
                    network={network}
                    setUpdateTokensList={setUpdateTokensList}
                  />
                );
              }
            }
          });
      }
    })();
  }, []);

  const setTitle = (status: TxStatus): string => {
    switch (status) {
      case "Mining":
        return "In progress";
      case "Success":
        return "Finished";
      case "Error":
        return "Error";
      case "Cancelled":
        return "Cancelled";
      case "Speed":
        return "Speed up";
      default:
        return "";
    }
  };

  const setEta = (status: TxStatus): string => {
    switch (status) {
      case "Mining":
        return `${time}s`;
      case "Success":
        return "Done!";
      case "Error":
        return "None";
      case "Cancelled":
        return "None";
      case "Speed":
        return "None";
      default:
        return "";
    }
  };

  const setStatusColor = (status: TxStatus): string => {
    switch (status) {
      case "Mining":
        return `#D14EFF`;
      case "Success":
        return "#00C42B";
      case "Error":
        return "#F60C36";
      case "Cancelled":
        return "#F60C36";
      case "Speed":
        return "#009AFF";
      default:
        return "FAFAFA";
    }
  };

  return (
    <div className="w-72 h-32 rounded-md flex flex-col items-center justify-center">
      <span className="absolute top-1 left-1">{tx.nonce}</span>
      <span className="text-xl text-textGrey pt-3">{setTitle(status)}</span>
      <hr
        style={{
          borderTop: "1px solid #999999",
          width: "80%",
          height: "0px",
        }}
      />
      <span className="text-sm pt-3 text-textGrey flex-1 flex hover:underline hover:text-lightBlue">
        <a href={etherscanUrl} target={"_blank"} className="flex-1 flex">
          {status === "Mining"
            ? "Sending"
            : status === "Success"
            ? "Sent"
            : "Sending"}{" "}
          &#160;<b>{quantitySent}</b>&#160;
          <Icon>
            <img src={selectedToken.iconUrl} width="20px"></img>
          </Icon>
          <b>{selectedToken.name}</b>&#160;to&#160;
          <b>
            {tx?.to?.slice(0, 5)}...
            {tx?.to?.slice(tx?.to?.length - 5, tx?.to?.length - 1)}
          </b>
          <ExternalLinkIcon
            width="20px"
            style={{ position: "relative", top: "-11px", left: "4px" }}
            className="text-lightBlue"
          />
        </a>
      </span>
      <div className="flex-1 text-sm text-textGrey flex flex-row flex-nowrap">
        <div className="flex-1 flex flex-row">
          Status:&#160;
          <div
            className="self-baseline border border-borderGrey rounded-sm px-2"
            style={{
              color: setStatusColor(status),
            }}
          >
            <b>{status}</b>
          </div>
        </div>
        <div className="flex-1 flex flex-row ml-5">
          ETA:&#160;
          <div className="self-baseline border border-borderGrey rounded-sm px-2">
            {setEta(status)}
          </div>
        </div>
      </div>
      {status === "Mining" ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <LinearProgress variant="determinate" value={100} />
        </Box>
      )}
    </div>
  );
};

export default TransactionPopup;

type LocalTx = {
  hash: string;
  nonce: number;
  tokenQuantity: number;
  token: MappedToken;
  changedQuantity: number;
  gasPrice: number;
  gasLimit: number;
  network: "Mainnet" | "Rinkeby";
};

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

type TxCallException = {
  transaction: Transaction;
  transactionHash: string;
  receipt: providers.TransactionResponse;
};

type TxTransactionReplaced = {
  hash: string;
  reason: string;
  cancelled: boolean;
  replacement: providers.TransactionResponse;
  receipt: providers.TransactionReceipt;
};

type TxStatus = "Mining" | "Success" | "Error" | "Cancelled" | "Speed";
