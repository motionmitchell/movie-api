let http = require("http")
let url = require("url")
let fs = require("fs")
let host = "localhost"
let port = 8080
let requestListener = function (req, res) {
    // data is a the string containging the url your on and the date of today and a new line
    let data = req.url + Date.now() + "\n"
    console.log(req.url)
//this is acting like a text file acting like a database
    fs.appendFile('log.txt', data, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    console.log(req.url)
    if(req.url === "/documentation") {
        fs.readFile('documentation.html',function (err, data){
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
            res.end();
        });
    }
    else {
        fs.readFile('index.html',function (err, data){
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
            res.end();
        });
    }
    // res.writeHead(200);
    // res.end("My first server!");
};
let server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});