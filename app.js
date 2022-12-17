const express = require("express");
const {getWlMap} = require("./helpers/parseWL");
const app = express()
const port = 3000

const wlMap = getWlMap()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/is_while_list_sale', (req, res) => {
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

// app.get("/EssenceContractInfo", (req, res) => {
//     let object = {}
// })
//
// app.get("/")


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})