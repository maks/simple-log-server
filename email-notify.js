/*jshint node:true */

"use strict";

var fs = require("fs");

/**

 */
exports.notify = function(mesg) {
    var email   = require("emailjs"),
        server  = email.server.connect({
            user:    "maks@manichord.com", 
            password:"xmjuzybkansvejgl", 
            host:    "smtp.gmail.com", 
            ssl:     true
        }),
        recipientList = fs.readFileSync('recipients.csv');
    // send the message and get a callback with an error or details of the message that was sent
    server.send({
       text:    mesg, 
       from:    "logging <admin@manichord.com>", 
       to:      recipientList,
       subject: "log error message"
    }, function(err, message) { 
        console.log(err || message); 
    });
};
