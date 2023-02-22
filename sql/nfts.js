const {Client} = require('pg');
const {StartBlock} = require("../constants");
const dbInfo = require('dotenv').config().parsed;


const client = new Client({
    port: dbInfo.port,
    host: dbInfo.host,
    user: dbInfo.user,
    database: dbInfo.database,
    password: dbInfo.password,
});


client.connect().then(console.log("Db connected"));


(async () => {
    await client.query("CREATE TABLE IF NOT EXISTS nfts (" +
        "burn_hash VARCHAR(255) NOT NULL," +
        "burn_block VARCHAR(255) NOT NULL," +
        "number NUMERIC NOT NULL," +
        "burn_nonce NUMERIC NOT NULL," +
        "mint_nonce NUMERIC NOT NULL," +
        "owner VARCHAR(255) NOT NULL," +
        "id NUMERIC," +
        "is_randomized BOOLEAN DEFAULT FALSE," +
        "is_claimed BOOLEAN DEFAULT FALSE," +
        "reveal_block VARCHAR(255)," +
        "reveal_hash VARCHAR(255)," +
        "UNIQUE (burn_hash, number,burn_nonce, mint_nonce, owner)" +
        ")")
})()

module.exports.insertNewBurn = async (burn_hash, burn_block, number, burn_nonce, mint_nonce, owner) => {
    try {
        await client.query(`INSERT INTO nfts (
                                               burn_hash, 
                                               burn_block,
                                               number,
                                               owner,
                                               burn_nonce,
                                               mint_nonce
                                         )
        VALUES ( 
            '${burn_hash}',
            ${burn_block},
            ${number},
            '${owner.toLowerCase()}',
            ${burn_nonce},
            ${mint_nonce})`);
    } catch (e) {
        console.log("DUPLICATE OR FAIL ",burn_hash);
    }
}


module.exports.setRevealed = async (reveal_hash,reveal_block, owner, mint_nonce) => {
    const query = `UPDATE nfts SET is_claimed=TRUE, reveal_block=${reveal_block}, reveal_hash='${reveal_hash}'
                    WHERE  owner='${owner.toLowerCase()}' AND nfts.mint_nonce<${mint_nonce}`
    await client.query(query);
}

module.exports.setRandomized = async (burn_hash, owner, number,id) => {
    const query = `UPDATE nfts SET is_randomized=TRUE, id=${id}
                    WHERE owner='${owner.toLowerCase()}' AND
                     burn_hash='${burn_hash}'
                      AND number=${number}`
    await client.query(query);
}


module.exports.getUnMinted = async () => {
    const result = await client.query(`SELECT id FROM nfts WHERE is_claimed=FALSE AND is_randomized=TRUE`);
    return result.rows;
}

module.exports.getUnMintedForUser = async (owner) => {
    const result = await client.query(`SELECT * FROM nfts
            WHERE is_claimed=FALSE AND 
                  is_randomized=TRUE AND 
                  owner='${owner.toLowerCase()}'`);
    return result.rows;
}

module.exports.getNewBurns = async () => {
    const query = `SELECT * FROM nfts WHERE is_claimed=FALSE AND is_randomized=FALSE`;
    const result = await client.query(query);
    return result.rows;
}



module.exports.getLastBlock = async () => {
    let query = "SELECT * FROM nfts ORDER BY burn_block DESC LIMIT 1";
    const resultBurn = await client.query(query);
    query = "SELECT * FROM nfts ORDER BY reveal_block DESC LIMIT 1";
    const resultReveal = await client.query(query);

    let finalResult = StartBlock;

    if (resultBurn.rows.length > 0 && resultBurn.rows[0].burn_block > finalResult) {
        finalResult = resultBurn.rows[0].burn_block;
    }

    if (resultReveal.rows.length > 0 && resultReveal.rows[0].reveal_block > finalResult) {
        finalResult = resultReveal.rows[0].reveal_block;
    }

    return parseInt(finalResult)-1;
}
