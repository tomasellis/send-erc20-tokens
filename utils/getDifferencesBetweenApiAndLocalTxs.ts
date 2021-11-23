import { Dictionary, LocalTx } from "./types";

const getDifferencesBetweenApiAndLocalTxs = (
  apiTxs: Dictionary<LocalTx>,
  localTx: Dictionary<LocalTx> | null
) => {
  if (localTx !== {}) {
    let localTxsQuantity = 0;
    let localTxsNonces = [];

    // Count txs saved locally
    for (let txNonce in localTx) {
      console.log("TxNonce N°:", txNonce);
      localTxsQuantity++;
      localTxsNonces.push(parseInt(txNonce));
    }

    localTxsNonces.sort((a, b) => b - a);
    console.log("LocalTxsQuantity:", localTxsQuantity, localTxsNonces);

    return;
  }
  console.log("Null txs locally");
  return apiTxs;
};

export default getDifferencesBetweenApiAndLocalTxs;
