const CSVToJSON = require('csvtojson')
const {signWl} = require("./sign");



module.exports.getWlMap = async() =>{
    let result = new Map();
    let jsonWl = await CSVToJSON().fromFile('files/WL.csv');
    for(let i = 0; i < jsonWl.length;i++){
        let {Address,id} = jsonWl[i];
        Address = Address.toLowerCase();
        let date = (new Date()).getTime();
        let object = {
            id:id,
            nonce:date,
            sig: await signWl(Address,id,date)
        }

        if(result.has(Address)){
            console.log("DUPLICATED")
        }
        result.set(Address,object);
    }

    return result;
}


