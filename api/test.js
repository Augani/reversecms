
const jsftp = require("jsftp");
var Client = require('ftp');
 
var fs = require('fs');
 
var c = new Client();
c.on('ready', function() {
  c.get('590a_Contiki-590A.csv',async function(err, stream) {
    if (err) throw err;
    stream.once('close', function() { c.end(); });
    console.log(stream);
    await fs.writeFileSync('./test/590a_Contiki-590A.csv', '');
    stream.pipe(fs.createWriteStream('./test/590a_Contiki-590A.csv'));
  });
});
// connect to localhost:21 as anonymous
c.connect({
  host: "ftp.dlptest.com",
  port: 21, // defaults to 21
  user: "dlpuser@dlptest.com", // defaults to "anonymous"
  password: "SzMf7rTE4pCrf9dV286GuNe4N" // defaults to "@anonymous"
});



var PromiseFtp = require('promise-ftp');
var fs = require('fs');

var ftp = new PromiseFtp();
const GetWebSite = ({host, user, password})=>{
  ftp.connect({host: host, user: user, password: password})
.then(function (serverMessage) {
  return ftp.get('foo.txt');
}).then(function (stream) {
  return new Promise(function (resolve, reject) {
    stream.once('close', resolve);
    stream.once('error', reject);
    stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
  });
}).then(function () {
  return ftp.end();
});

}

GetWebSite({
  host: "ftp.dlptest.com",
  port: 21,
  user: "dlpuser@dlptest.com", 
  password: "SzMf7rTE4pCrf9dV286GuNe4N"

})


module.exports = GetWebSite;

