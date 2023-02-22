const {abi} = require("../abi/MysteryCards.json");
const {ethers, utils} = require("ethers");
const {MysteryCards} = require("../constants");
const nfts = require("../sql/nfts.js");

module.exports.catchNewBurns = async (provider) => {
    const atomicPairInterface = new utils.Interface(abi)
    const start_block = await nfts.getLastBlock();
    const end_block = await provider.getBlockNumber();

    let logs = await provider.getLogs({
        fromBlock: start_block,
        toBlock: end_block,
        address: MysteryCards,
    });

    for (let i = 0; i < logs.length; i++) {
        let log = logs[i]
        let parsedLog;

        try {
            parsedLog = atomicPairInterface.parseLog(log)
        } catch (e) {
        }
        if (parsedLog) {
            switch (parsedLog.name) {
                case atomicPairInterface.getEvent('NewBurn').name:
                    for (let i = 0; i < parseInt(parsedLog.args.amount); i++) {
                        await nfts.insertNewBurn(log.transactionHash,
                            log.blockNumber,
                            i,
                            parsedLog.args.burnNonce.toString(),
                            parsedLog.args.mintNonce.toString(),
                            parsedLog.args.user
                        );

                    }
                    break;
                case atomicPairInterface.getEvent('NewReveal').name:
                    await nfts.setRevealed(log.transactionHash,
                        log.blockNumber,
                        parsedLog.args.user,
                        parsedLog.args.mintNonce.toString()
                    )
                    break;
                default:
                    break;
            }
        }
    }
}