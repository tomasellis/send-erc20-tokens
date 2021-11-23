import { Dictionary, LocalTx } from "./types";

const getDifferencesBetweenApiAndLocalTxs = (
  apiTxs: Dictionary<LocalTx>,
  localTxs: Dictionary<LocalTx> | null
): Dictionary<LocalTx> | "KeepPooling" | "NoLocalTxs" => {
  let localTxsNonces = [];

  // Count txs saved locally
  for (let txNonce in localTxs) {
    console.log("TxNonce N°:", txNonce);
    localTxsNonces.push(parseInt(txNonce));
  }

  if (localTxsNonces.length > 0 && localTxs !== null) {
    localTxsNonces.sort((a, b) => b - a);

    console.log("LocalTxsQuantity:", localTxsNonces.length, localTxsNonces);

    // Now check for differences
    let flag = false;

    // If there are locally saved txs
    for (let i = 0; i < localTxsNonces.length; i++) {
      // Now, move through the dictionary checking
      const nonce = localTxsNonces[i];
      // If we can find the tx in the api data, then it has been resolved
      if (apiTxs[nonce] !== undefined) {
        // We check if the tx is saved locally with a pending status, let's update it
        if (localTxs[nonce].status !== apiTxs[nonce].status) {
          flag = true;
          console.log("Tx N°:", nonce, "has changed");
          console.log("This is the Tx before", localTxs[nonce]);
          localTxs[nonce] = {
            ...apiTxs[nonce],
            network: localTxs[nonce].network,
            token: localTxs[nonce].token,
            tokenQuantity: localTxs[nonce].tokenQuantity,
            changedQuantity: localTxs[nonce].changedQuantity + 1,
          };
          console.log("This is the new Tx", localTxs[nonce]);
        }
      }
    }

    console.log("Inside flag is:", flag);
    if (flag === true) {
      return localTxs;
    } else if (localTxs[localTxsNonces[0]].status !== "Pending") {
      return "NoLocalTxs";
    } else {
      return "KeepPooling";
    }
  }
  console.log("Null txs locally");
  return "NoLocalTxs";
};

export default getDifferencesBetweenApiAndLocalTxs;
