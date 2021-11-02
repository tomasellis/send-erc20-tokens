import {
  BalanceMap,
  getTokenBalances,
  getTokensBalance,
} from "@mycrypto/eth-scan";
import react, { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";

const MainScreen = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<"mainnet" | "rinkeby" | string>(
    "rinkeby"
  );

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

  useEffect(() => {
    console.log(provider);
  }, [provider]);

  return (
    <div className="w-60 h-96 rounded-md border border-red-500 flex flex-col">
      {`Send a token on the ${network} network`}
      <div>
        <input
          type="radio"
          id="Rinkebty"
          name="Rinkeby"
          value="rinkeby"
          checked={network === "rinkeby"}
          onChange={(e) => setNetwork(e.target.value)}
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
          onChange={(e) => setNetwork(e.target.value)}
        />
        <label>Mainnet</label>
      </div>
      <input
        onChange={(e) => setUserAddress(e.target.value)}
        placeholder="Please input an address"
      />
      {userAddress !== "" ? `The user address is: ${userAddress}` : ""}
      <button
        style={{ border: "5px" }}
        onClick={async () => {
          const balances = await getTokensBalance(provider, userAddress, [
            "0xdd1ad9a21ce722c151a836373babe42c868ce9a4",
          ]);
          console.log(
            "HERE",
            Number(balances["0xdd1ad9a21ce722c151a836373babe42c868ce9a4"]) /
              Math.pow(10, 18)
          );
        }}
      >
        Here
      </button>
    </div>
  );
};

export default MainScreen;
