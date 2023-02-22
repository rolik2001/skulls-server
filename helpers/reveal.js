const nfts = require("../sql/nfts.js");
const {signMystery} = require("./sign");

module.exports.getAllNonMinted = async (owner) => {
    const allNonMinted = await nfts.getUnMintedForUser(owner);

    const nftToMint = new Map();
    let burnNonce = 0;
    for (let i = 0; i < allNonMinted.length; i++) {
        let {id, burn_nonce} = allNonMinted[i];
        if (nftToMint.has(id)) {
            nftToMint.set(id, (nftToMint.get(id) + 1))
        } else {
            nftToMint.set(id, 1);
        }
        if (parseInt(burn_nonce) > burnNonce) {
            burnNonce = parseInt(burn_nonce);
        }
    }

    const ids = [];
    const amounts = [];

    for (const [key, val] of nftToMint) {
        ids.push(parseInt(key));
        amounts.push(val);
    }

    const signature = await signMystery(ids, amounts, burnNonce, owner);


    return {
        ids,
        amounts,
        nonce: burnNonce,
        signature
    }
}