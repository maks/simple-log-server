/*jshint node:true */

"use strict";

var util = require("util"),
    http = require("http"),
    dateFormat = require("dateformat"),
    email = require("./email-notify"),
    
    PORT = 8000,
    
    defaultBackend = "./console-backend",
    backend = (process.argv[2]) ? "./"+process.argv[2] : defaultBackend,
    recordMessage = require(backend).recordMessage,
    getMessages = require(backend).getMessages;
    
http.createServer(function (req, res) {
    var content = "";
    
    if (req.method === "GET") {
        getMessages(0,0, function(err, data) {
            if (err) {
                res.statusCode = 404;
                res.write(err.toString()+"\n");
            } else {
                res.statusCode = 200;                
                res.write(data);
            }
            res.end();
        });        
    } else if (req.method === 'POST') {    
        req.addListener("data", function(chunk) {
                content += chunk;
        });
        req.addListener("end", function() {
            var logline,
                logData; //Expect logData to be { mesg: 'mesg text', level : 'error|warning|info|debug', category : 'something' }            
                
                try {
                    logData = JSON.parse(content);
                } catch(e) {
                    console.error("invalid JSON log data "+content);
                }              
                if (logData) {                    
                    logline = [
                        dateFormat((new Date()).toString(), "isoDateTime"), 
                        "["+logData.level+"]", 
                        "{"+logData.category+"}", 
                        logData.mesg, "\n"
                    ].join(" ");
                    recordMessage(req, logline);
                    if (logData.level === "error") {
                        email.notify(logline);                    
                    }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("log data");                    
                } else {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/plain");
                    res.write("error processing log data");                    
                }
                res.end();
        });
    } else {
        req.addListener("end", function() {
              res.statusCode = 405;
              res.setHeader("Content-Type", "text/plain");
              res.end();
        });
    }
}).listen(PORT);

console.info("Listening on "+PORT);
console.info("backend: "+backend);
