var mongoose = require("mongoose");
const { ipList, referersList, config } = require("./../models")

async function check(action, input) {

    if(action === "referer") {

    var r = await referersList.findOne({ referer: input });
    
    if(!r) {
        await referersList.create({ referer: input, status: "allow"});
        return "referer allowed"
    }

    if(r) {
    var rs = r["status"];
        if(rs === "deny") return "referer blocked"
        if(rs === "allow") return "referer allowed"
    }

    };

    if(action === "ip") {

        var ipr = await ipList.findOne({ ip: input });
        
        if(!ipr) {
            await ipList.create({ ip: input, status: "allow"});
            return "ip allowed";
        }

        if(ipr) {
        var iprs = ipr["status"];
            if(iprs === "deny") return "ip blocked"
            if(iprs === "allow") return "ip allowed"
        }
    
    };

};

module.exports = {
    check: check
}