import react, { useState } from "react";

import { Network } from "../../utils/types";

import Banner from "../MainScreenComponents/AppComponents/Banner";

const App = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<Network>("Rinkeby");

  return (
    <>
      <Banner
        network={network}
        setNetwork={setNetwork}
        userAddress={userAddress}
        setUserAddress={setUserAddress}
      />
    </>
  );
};

export default App;
