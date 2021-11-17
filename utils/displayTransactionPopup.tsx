import { ethers } from "ethers";
import { toast } from "react-toastify";
import TransactionPopup from "../components/TransactionPopup";

const displayTransactionPopup = (
  tx: ethers.providers.TransactionResponse,
  quantitySent: string,
  selectedToken: MappedToken,
  network: "Mainnet" | "Rinkeby"
) => {
  toast(
    <TransactionPopup
      tx={tx}
      quantitySent={quantitySent}
      selectedToken={selectedToken}
      network={network}
    />,
    {
      onClose: () => {
        alert(`Borra tx N° ${tx.nonce}`);
      },
    }
  );
};

export default displayTransactionPopup;

type MappedToken = {
  address: string;
  name: string;
  iconUrl: string;
  balance: number;
};
