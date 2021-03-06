import axios, { AxiosResponse } from "axios";
import { Network, MappedToken } from "../utils/types";

const getTokenList = async (network: Network): Promise<MappedToken[]> => {
  try {
    if (network === "Mainnet") {
      const { data }: AxiosResponse<TokenData> = await axios({
        url: graphUrl,
        method: "POST",
        data: {
          query: tokensQuery,
        },
      });

      const registries = data.data.registries;

      const mappedTokens = registries[0].tokens.map((token) => {
        let mappedToken: MappedToken = {
          address: token.address,
          name: token.name,
          iconUrl: klerosIpfsBaseUrl + token.symbolMultihash,
          balance: 0,
        };
        return mappedToken;
      });

      return mappedTokens;
    } else if (network === "Rinkeby") {
      let mappedTokens: MappedToken[] = [];

      let tk: MappedToken = {
        address: "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
        balance: 0,
        iconUrl:
          "https://s2.coinmarketcap.com/static/img/coins/200x200/2308.png",
        name: "DAIDev",
      };

      mappedTokens.push(tk);

      tk = {
        address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        balance: 0,
        iconUrl: "",
        name: "LINKDev",
      };

      mappedTokens.push(tk);

      return mappedTokens;
      // TO FIX: remove test tokens -----------------------------------------
    } else {
      return [];
    }
  } catch (err) {
    console.log("getTokenList", err);
    return [{ address: "0", balance: 0, iconUrl: "", name: "Error" }];
  }
};

export default getTokenList;

// ------------------------ UTILS ------------------------

type TokenData = {
  data: {
    registries: Registries[];
  };
};

type Registries = {
  id: string;
  tokens: Token[];
};

type Token = {
  address: string;
  name: string;
  status: string;
  symbolMultihash: string;
  ticker: string;
};

const graphUrl = `https://api.thegraph.com/subgraphs/name/kleros/t2cr`;

// TO FIX: first:1000
const tokensQuery = `query getTokens {
  registries{
    id
    tokens(where: {status_in:[Registered]}) {
      name
      ticker
      address
      symbolMultihash
      status
    }
  }
}
`;

const klerosIpfsBaseUrl = `https://ipfs.kleros.io`;
