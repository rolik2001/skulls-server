const CSVToJSON = require('csvtojson')
const {signWl} = require("./sign");

const nonce = 1;

module.exports.getWlMap = async() =>{
    let result = new Map();
    let jsonWl = await CSVToJSON().fromFile('files/WL.csv');
    for(let i = 0; i < jsonWl.length;i++){
        let {address,id} = jsonWl[i];
        address = address.toLowerCase();
        let object = {
            id:id,
        }

        result.set(address,object);
    }

    return result;
}


