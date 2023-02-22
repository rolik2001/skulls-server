const ethers = require("ethers");
const {MysteryCards} = require("../constants");

const signerPriv = require('dotenv').config().parsed.PRIV;

module.exports.signWl = async (user, id, nonce) => {
    const signer = new ethers.Wallet(signerPriv);
    const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "uint256", "address"],
        [id, nonce, user]
    )

    let messageHashBytes = ethers.utils.arrayify(messageHash)
    return await signer.signMessage(messageHashBytes);
}

module.exports.signMystery = async(ids,amounts,nonce,owner) => {
    const signer = new ethers.Wallet("e49391ea82df278f55082e8279425743df15f1ec6567e40b181f0edae551250e");

    let domain = {
        name: "MysteryCardsManager",
        version: "1.0",
        chainId: "5",
        verifyingContract: MysteryCards,
    }


    const dataType = {
        MysteryCardsManager: [
            {name: "ids", type: "uint256[]"},
            {name: "amounts", type: "uint256[]"},
            {name: "nonce", type: "uint256"},
            {name: "owner", type: "address"}
        ],
    };

    let data = {
        ids,
        amounts,
        nonce,
        owner,
    }

    return await signer._signTypedData(domain, dataType, data);

}