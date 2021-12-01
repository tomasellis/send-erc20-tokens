import { MappedToken } from "../utils/types";

const filterTokensBySearchTerm = (
  tokens: MappedToken[],
  searchTerm: string
) => {
  const filteredTokenList = tokens.filter((token) => {
    const hackyFuzzySearchName = token.name.toLowerCase();
    const hackyFuzzySearchTerm = searchTerm.toLowerCase();
    return hackyFuzzySearchName.includes(hackyFuzzySearchTerm);
  });
  return filteredTokenList;
};

export default filterTokensBySearchTerm;
