var util = require('util');

exports.recordMessage = function (request, msg) {
    util.puts("received: " + msg);
};

exports.getMessages = function(start, end, callback) {
    callback("NA");
}