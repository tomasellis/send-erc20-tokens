import { getTokensBalance } from "@mycrypto/eth-scan";
import { ethers } from "ethers";

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};

export default async (
  userAddress: string,
  tokenList: MappedToken[],
  provider: ethers.providers.JsonRpcProvider
): Promise<MappedToken[]> => {
  // Array with token addresses
  const tokensAddresses = tokenList.map((token) => token.address);

  // Balances with external lib
  try {
    const balances = await getTokensBalance(
      provider,
      userAddress,
      tokensAddresses
    );

    // Update balances
    const tokenListWithBalances: MappedToken[] = tokenList.map((token) => {
      return {
        address: token.address,
        name: token.name,
        iconUrl: token.iconUrl,
        balance:
          Number(balances[token.address]) !== 0
            ? Number(balances[token.address]) / Math.pow(10, 18)
            : 0,
      };
    });

    // TO FIX: balance log
    console.log(
      "LINK BALANCE",
      tokenListWithBalances[tokenListWithBalances.length - 1]
    );

    return tokenListWithBalances;
  } catch (err) {
    console.log(err);
    return [{ address: "", balance: 0, iconUrl: "", name: "ERROR" }];
  }
};
