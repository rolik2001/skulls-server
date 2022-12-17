const express = require("express");
const cors = require('cors');
const {getWlMap} = require("./helpers/parseWL");
const app = express()
const port = 80

const wlMap = getWlMap();
app.use(cors());

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.post('/is_while_list_sale', (req, res) => {
    let result = {
        whiteList: false
    }

    try {
        let {address} = req.body;
        address = address.toLowerCase();

        if (wlMap.has(address)) {
            result.whiteList = true;
            result = {...result, ...wlMap.get(address)}
        }
        res.send(JSON.stringify(result));
    } catch (e) {
        res.send(JSON.stringify(result));
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})