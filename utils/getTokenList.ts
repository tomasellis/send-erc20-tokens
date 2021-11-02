import axios, { AxiosResponse } from "axios";

const getTokenList = async (): Promise<MappedToken[] | undefined> => {
  try {
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
      };
      return mappedToken;
    });

    console.log("SIZE", mappedTokens.length);
    return mappedTokens;
  } catch (err) {
    console.log("getTokenList", err);
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

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
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
