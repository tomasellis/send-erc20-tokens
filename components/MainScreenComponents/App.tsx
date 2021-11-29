import react, { useEffect, useState } from "react";
import getTokenList from "../../utils/getTokenList";

import { Network, MappedToken } from "../../utils/types";

import Banner from "../MainScreenComponents/AppComponents/Banner";

const App = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [network, setNetwork] = useState<Network>("Rinkeby");
  const [tokensList, setTokensList] = useState<MappedToken[]>([]);

  useEffect(() => {
    // Get token list whenever the network changes
    (async () => {
      const apiTokens = await getTokenList(network);
      setTokensList(apiTokens);
    })();
  }, [network]);

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
