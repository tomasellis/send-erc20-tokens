import { providers } from "ethers";
import react, { useEffect, useState } from "react";
import { ToastProps } from "react-toastify/dist/types";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { Icon } from "@mui/material";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import { toast } from "react-toastify";

const TransactionPopup = ({
  tx,
  toastProps,
  selectedToken,
  quantitySent,
  network,
  closeToast,
  setUpdateTokensList,
}: {
  setUpdateTokensList: React.Dispatch<react.SetStateAction<boolean>>;
  tx: providers.TransactionResponse;
  closeToast?: any;
  toastProps?: ToastProps;
  selectedToken: MappedToken;
  quantitySent: string;
  network: "Rinkeby" | "Mainnet";
}) => {
  const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;
  const baseEtherscanUrl =
    network === "Mainnet"
      ? `https://etherscan.io`
      : `https://rinkeby.etherscan.io`;
  const etherscanUrl = `${baseEtherscanUrl}/tx/${tx.hash}`;
  const timeEstimationUrl = `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${
    tx !== undefined && tx.gasPrice !== undefined
      ? tx.gasLimit.toNumber() * tx.gasPrice.toNumber()
      : ""
  }&apikey=${etherscanApiToken}`;

  const [status, setStatus] = useState<"Mining" | "Success" | "Error">(
    "Mining"
  );
  const [time, setTime] = useState<string>("");

  console.log("CLOSE", closeToast);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(timeEstimationUrl);
      const seconds = data.result;
      setTime(seconds);
      await tx
        .wait()
        .then((value: any) => {
          console.log("TX VALUE DONE?", value);
          setStatus("Success");
          setUpdateTokensList(true);
        })
        .catch((err) => {
          console.log("TX VALUE ERR", err);
          setStatus("Error");
        });
    })();
  }, []);
  return (
    <div className="w-72 h-32 rounded-md flex flex-col items-center justify-center">
      <span className="text-xl text-textGrey pt-3">
        {status === "Mining"
          ? "In progress"
          : status === "Success"
          ? "Finished"
          : "Error"}
      </span>
      <hr
        style={{
          borderTop: "1px solid #999999",
          width: "80%",
          height: "0px",
        }}
      />
      <span className="text-sm pt-3 text-textGrey flex-1 flex">
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
          {tx?.to?.slice(0, 8)}...
          {tx?.to?.slice(tx?.to?.length - 5, tx?.to?.length - 1)}
        </b>
        <a href={etherscanUrl} target={"_blank"}>
          <ExternalLinkIcon
            width="20px"
            style={{ position: "relative", top: "-1px", left: "4px" }}
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
              color:
                status === "Mining"
                  ? "#D14EFF"
                  : status === "Success"
                  ? "#00C42B"
                  : "#F60C36",
            }}
          >
            <b>{status}</b>
          </div>
        </div>
        <div className="flex-1 flex flex-row ml-5">
          ETA:&#160;
          <div className="self-baseline border border-borderGrey rounded-sm px-2">
            {status === "Mining"
              ? `${time}s`
              : status === "Success"
              ? "Done!"
              : "ERROR"}
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

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};
