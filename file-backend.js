var util = require("util"),
    fs = require("fs"),
    filename = "./received.log";   

exports.recordMessage = function(request, msg) {
    fs.appendFileSync(filename, msg);
}

exports.getMessages = function(start, end, callback) {
    fs.readFile(filename, function (err, data) {
      callback(err, data);
    });
}