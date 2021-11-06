import axios from "axios";

const etherscanApiToken = process.env.NEXT_PUBLIC_ETHERSCAN_API_TOKEN;

const getUserTransactions = async (address: string) => {
  const txEndpoint = `${etherscanBaseURL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${etherscanApiToken}`;

  const { data } = await axios.get(txEndpoint);

  console.log("RES DATA", data);
};

export default getUserTransactions;

// CONSTS

const etherscanBaseURL = "https://api.etherscan.io/api";
