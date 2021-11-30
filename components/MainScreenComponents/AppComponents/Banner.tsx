import react, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { GlobeIcon } from "@heroicons/react/solid";

import connectWallet from "../../../utils/connectWallet";

import { Network } from "../../../utils/types";

const Banner = ({
  userAddress,
  setUserAddress,
  network,
  setNetwork,
}: {
  userAddress: string;
  setUserAddress: react.Dispatch<react.SetStateAction<string>>;
  network: Network;
  setNetwork: react.Dispatch<react.SetStateAction<Network>>;
}) => {
  useEffect(() => {
    if (userAddress === "") {
      // @ts-ignore
      const { ethereum } = window;
      // Disconnect the event listener when account is disconnected
      ethereum.removeListener("accountsChanged", (event: any) => {
        console.log(event);
      });
      ethereum.removeListener("chainChanged", (event: any) => {
        console.log(event);
      });
    }
  }, [userAddress]);

  return (
    <div id="Banner" style={{ height: "fit-content" }} className="w-full flex">
      <div className="flex-1 flex justify-end">
        {userAddress === "" ? (
          <button
            className="px-3 py-1 my-2 mr-3 rounded-2xl text-2xl text-accentPurple border-2 border-accentPurple bg-lightPurple"
            onClick={async () => {
              const wallet = await connectWallet();

              // Listener to handle disconnect
              // @ts-ignore
              const { ethereum } = window;

              ethereum.on("accountsChanged", (accounts: Array<string>) => {
                if (accounts.length === 0) {
                  setUserAddress("");
                  toast.success("Succesfuly disconnected!", {
                    autoClose: 5000,
                    closeButton: false,
                  });
                }
              });

              ethereum.on("chainChanged", (chainId: string) => {
                const network = translateChain(chainId);
                setNetwork(network);
                toast.success(`Switched to ${network} network`, {
                  autoClose: 5000,
                  closeButton: false,
                });
              });

              switch (wallet.address) {
                case "ERROR":
                  return toast.error("Rejected account connection!");
                case "NOMETAMASK":
                  return toast.error("Please install Metamask");
                default:
                  toast.success("Succesfuly connected!", {
                    autoClose: 5000,
                    closeButton: false,
                  });
                  setNetwork(wallet.network);
                  return setUserAddress(wallet.address);
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
    </div>
  );
};

export default Banner;

const translateChain = (chainId: string) => {
  switch (chainId) {
    case "0x1":
      return "Mainnet";
    case "0x3":
      return "Ropsten";
    case "0x4":
      return "Rinkeby";
    case "0x5":
      return "Goerli";
    case "0x2a":
      return "Kovan";
    default:
      return "Rinkeby";
  }
};
