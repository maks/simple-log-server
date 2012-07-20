var util = require("util"),
    http = require("http"),
    dateFormat = require('dateformat'),
    
    PORT = 8000,
    
    defaultBackend = "./console-backend",
    backend = (process.argv[2]) ? "./"+process.argv[2] : defaultBackend,
    recordMessage = require(backend).recordMessage,
    getMessages = require(backend).getMessages;
    
http.createServer(function (req, res) {
    var content = "";
    
    if (req.method === 'GET') {
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
            var logline = [dateFormat((new Date()).toString(), "isoDateTime"), content, "\n"].join(" ");
              recordMessage(req, logline);
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/plain");
              res.write("stored message:"+logline);
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
