const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const {getWlMap} = require("./helpers/parseWL");
const {getNonce} = require("./helpers/getNonce");
const {signWl} = require("./helpers/sign");
const app = express();
const port = 80

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

let wlMap = new Map();


app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.post('/is_white_list_sale', async (req, res) => {
    // let wlMap = await getWlMap();
    let result = {
        whiteList: false
    }

    try {
        let {owner} = req.body;
        owner = owner.toLowerCase();
        if (wlMap.has(owner)) {
            result.whiteList = true;
            result = {...result, ...wlMap.get(owner)}
            if (owner === ("0xE43cA851127eac897AC4e766976E3a7a7aD7339d").toLowerCase())
                result.nonce = await getNonce("0xE43cA851127eac897AC4e766976E3a7a7aD7339d")
            // let nonce = await getNonce(owner);
            result = {
                ...result,
                // nonce,
                sig: await signWl(owner, result.id, result.nonce)
            }
        }
        res.send(JSON.stringify(result));
    } catch (e) {
        res.send(JSON.stringify(result));
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function init() {
    wlMap = await getWlMap();
}


init();