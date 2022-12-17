const ethers = require("ethers");

const signerPriv = "2b85e973f83e404f80569c43ae3554a783e407cd19d20e08d869e50b7bc014c9";

module.exports.signWl = async (user, id, nonce) => {
    const signer = new ethers.Wallet(signerPriv);

    const messageHash = ethers.utils.solidityKeccak256(
        ["uint256", "uint256","address"],
        [id, nonce,user]
    )
    let messageHashBytes = ethers.utils.arrayify(messageHash)
    return await signer.signMessage(messageHashBytes);
}