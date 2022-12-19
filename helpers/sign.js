const ethers = require("ethers");

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