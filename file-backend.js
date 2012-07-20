var util = require("util"),
    fs = require("fs"),
    filename = "./logs.received",
    fd = fs.openSync(filename, 'a');    

exports.recordMessage = function(request, msg) {
    fs.writeSync(fd, msg);
}

exports.getMessages = function(start, end) {
    
}