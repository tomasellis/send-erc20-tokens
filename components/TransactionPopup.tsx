import react, { useEffect, useState } from "react";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { Icon } from "@mui/material";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import { Transaction } from "ethers";
import { LocalTx, TxStatus } from "../utils/types";

const TransactionPopup = ({ tx }: { tx: LocalTx }) => {
  const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

  const baseEtherscanUrl =
    tx.network === "Mainnet" ? `etherscan.io` : `rinkeby.etherscan.io`;

  const etherscanUrl = `https://${baseEtherscanUrl}/tx/${tx.hash}`;

  const timeEstimationUrl = `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${
    tx.gasLimit * tx.gasPrice
  }&apikey=${etherscanApiToken}`;

  const [status, setStatus] = useState<TxStatus>(tx.status);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(timeEstimationUrl);
      const seconds = data.result;
      setTime(seconds);
    })();
  }, []);

  const setTitle = (status: TxStatus): string => {
    switch (status) {
      case "Success":
        return "Finished";
      case "Error":
        return "Error";
      case "Pending":
        return "Pending";
      default:
        return "";
    }
  };

  const setEta = (status: TxStatus): string => {
    switch (status) {
      case "Pending":
        return `${time}s`;
      case "Success":
        return "Done!";
      case "Error":
        return "None";
      default:
        return "";
    }
  };

  const setStatusColor = (status: TxStatus): string => {
    switch (status) {
      case "Pending":
        return `#D14EFF`;
      case "Success":
        return "#00C42B";
      case "Error":
        return "#F60C36";
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
          {status === "Pending"
            ? "Sending"
            : status === "Success"
            ? "Sent"
            : "Sending"}{" "}
          &#160;<b>{tx.tokenQuantity}</b>&#160;
          <Icon>
            <img src={tx.token.iconUrl} width="20px"></img>
          </Icon>
          <b>{tx.token.name}</b>&#160;to&#160;
          <b>
            {tx.to?.slice(0, 5)}...
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
      {status === "Pending" ? (
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
