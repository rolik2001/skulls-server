const ethers = require("ethers");
const contractAbi = require("../abi/RektSkullsEssences.json");
const {NodeUrl, essences_contract} = require("../constants");


module.exports.getNonce = async (address) => {
    const provider = new ethers.providers.JsonRpcProvider(NodeUrl);
    const essencesContract = new ethers.Contract(
        essences_contract,
        contractAbi,
        provider
    )

    let nonce = await essencesContract.mintNonce(address);

    return parseInt(nonce.toString())+1;
}
