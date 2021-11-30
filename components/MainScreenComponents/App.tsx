import react, { useState } from "react";

import { Network } from "../../utils/types";

import Banner from "../MainScreenComponents/AppComponents/Banner";
import TokenSelection from "./AppComponents/TokenSelection";

const App = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<Network>("Rinkeby");

  return (
    <div className="flex-1 flex flex-col flex-nowrap">
      <Banner
        network={network}
        setNetwork={setNetwork}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
      <TokenSelection userAddress={userAddress} network={network} />
    </div>
  );
};

export default App;
