const {abi} = require("../abi/RektSkullsEssences.json");
const nfts = require("../sql/nfts");
const {ethers} = require("ethers");
const {Essences_contract} = require("../constants");

const basicWeights = [0.4, 0.3, 0.2, 0.1];

module.exports.randomEssences = async (provider) => {
    const essenceContract = new ethers.Contract(
        Essences_contract,
        abi,
        provider
    )

    const basicSupply = [];
    for (let i = 0; i < 4; i++) {
        let supply = await essenceContract.totalSupply(i + 1);
        basicSupply.push(parseInt(supply.toString()))
    }

    const unMintedIds = await nfts.getUnMinted();
    for(let i = 0; i < unMintedIds.length;i++){
        let {id} = unMintedIds[i];
        basicSupply[parseInt(id)-1]++;
    }


    const newRandoms = await nfts.getNewBurns();

    for (let i = 0; i < newRandoms.length; i++) {
        const element = newRandoms[i];
        const index = mintNewEssences(basicSupply);

        await nfts.setRandomized(
            element.burn_hash,
            element.owner,
            element.number,
            (index + 1)
        )
        basicSupply[index]++;
    }

}


function mintNewEssences(supply) {
    const total = supply.reduce((partialSum, a) => partialSum + a, 0);
    let finalWeights = [];
    for (let i = 0; i < basicWeights.length; i++) {
        const weightDiff = parseFloat((basicWeights[i] - supply[i] / total).toFixed(4))
        finalWeights.push(parseFloat((basicWeights[i] + weightDiff).toFixed(4)))
    }
    return getRandomIndex(finalWeights);
}


function getRandomIndex(weights) {
    const totalWeight = weights.reduce((acc, curr) => acc + curr, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) {
            return i;
        }
        random -= weights[i];
    }
}