var http  = require('http');
var url = require('url');
var statix = require('node-static');
var queries = require('./queries');

// Will serve files from "public" directory
// Files from this server are not cached (to make debugging easier)
var staticFileServer = new statix.Server('./public',{cache: 0});


function handler (request,response) {
    console.log("got request for "+request.url);
    var urlStr = request.url;
    var urlObj = url.parse(urlStr);    //  an object
    var pathname = urlObj.pathname; // the pathname part of the url
    var search = urlObj.search;     // the query part
    
    if ((search != undefined) && (pathname == "/query")) {
        queries.queryServer(request,response,search);
    } else {
        staticFileServer.serve(request,response);
    }
}

server = http.createServer(handler);
server.listen(5000);  // use your port number here!
