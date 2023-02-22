const {ethers} = require("ethers");
const {catchNewBurns} = require("./helpers/burnCatcher");
const {randomEssences} = require("./helpers/randomizer");
const {NodeUrl} = require("./constants");

async function analyzeNewBurns() {
    console.log("New Cron ", new Date().toISOString());
    try {
        const provider = new ethers.providers.JsonRpcProvider(NodeUrl);
        await catchNewBurns(provider);
        await randomEssences(provider);
    } catch (e) {
        console.log(e);
    }


    setTimeout(() => {
        analyzeNewBurns();
    }, 12000)

}


analyzeNewBurns();