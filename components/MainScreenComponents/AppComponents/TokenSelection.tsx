import React, { useEffect, useState } from "react";
import filterTokensBySearchTerm from "../../../utils/filterTokensBySearchTerm";
import getTokenList from "../../../utils/getTokenList";
import { MappedToken, Network } from "../../../utils/types";
import SingleTokenDisplay from "./SingleTokenDisplay";

const TokenSelection = ({
  userAddress,
  network,
}: {
  userAddress: string;
  network: Network;
}) => {
  const [fullTokensList, setFullTokensList] = useState<MappedToken[]>([]);
  const [filteredTokensList, setFilteredTokensList] = useState<MappedToken[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // Get token list whenever the network changes
    (async () => {
      const apiTokens = await getTokenList(network);
      setFullTokensList(apiTokens);
    })();
  }, [network]);

  useEffect(() => {
    const filteredTokens = filterTokensBySearchTerm(fullTokensList, searchTerm);
    setFilteredTokensList(filteredTokens);
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col flex-nowrap items-center w-full h-full border border-red-500">
      <div className="mt-16 text-5xl text-lightPurple">
        {userAddress === ""
          ? "Take a look around"
          : "Select the token you want to send"}
      </div>
      <div className="flex rounded-full border-lightPurple border mt-10">
        <input
          className="w-80 py-3 px-5 rounded mr-4 text-2xl outline-none text-center placeholder-lightPurple bg-transparent text-lightPurple"
          type="text"
          onFocus={(e) => {
            e.target.placeholder = "";
          }}
          onBlur={(e) => {
            e.target.placeholder = "or type to search...";
          }}
          placeholder="or type to search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <ul>
          {searchTerm === ""
            ? fullTokensList.map((token) => <li><SingleTokenDisplay  /></li>)
            : filteredTokensList.map((token) => <li>{token.name}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default TokenSelection;
