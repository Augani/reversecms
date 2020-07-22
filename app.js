require('dotenv').config()
var graphqlHTTP = require('express-graphql')
var graphql = require('graphql')
var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const Root = require('./api/resolvers')
const fs = require('fs')
const schema = require('./api/schema')
const unzipper = require('unzipper')
const mongoose = require('./api/Database')
const path = require('path')
const fse = require('fs-extra')
var nStatic = require('node-static');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ms = require('ms');
var timeout = require('connect-timeout');
const uploader = require('huge-uploader-nodejs');



const port = process.env.PORT || 4000
var app = express()
app.use(cors())
const multer = require('multer')
app.use(bodyParser.json({limit: "250mb"}));
app.use(bodyParser.urlencoded({limit: "250mb", extended: true, parameterLimit:250000}));




var defaultFolder = path.join(__dirname, 'tempFiles')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, defaultFolder)
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + '.zip')
  }
})

var upload = multer({ storage: storage })
const maxFileSize = 2;
const tmpDir = './tempFiles';
app.post('/upload',   (req, res, next) => {
 
 
  uploader(req, tmpDir, maxFileSize, 200)
  .then((assembleChunks) => {
      // chunk written to disk
      res.writeHead(204, 'No Content');
      res.end();
     
      // on last chunk, assembleChunks function is returned
      // the response is already sent to the browser because it can take some time if the file is huge
      if (assembleChunks) {
          // so you call the promise, it assembles all the pieces together and cleans the temporary files
          assembleChunks()
          // when it's done, it returns an object with the path to the file and additional post parameters if any
          .then((data) =>{
            let g = data.postParams;
           let thePath = path.join(__dirname ,'sites','local',g.username,g.pagename);
            let rename = './tempFiles/'+data.filePath.split("\\")[1]+'.zip'
            fs.rename(data.filePath, rename, function(err) {
              fs.createReadStream(rename).pipe(
                unzipper.Extract({ path: thePath })
              );
              // res.end("Sucessfull upload");
          });
          }) // { filePath: 'tmp/1528932277257', postParams: { email: 'upload@corp.com', name: 'Mr Smith' } }
          // errors if any are triggered by the file system (disk is full…)
          .catch(err => console.log(err));
      }
  })
  .catch((err) => {
      if (err.message === 'Missing header(s)') {
          res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
          res.end('Missing uploader-* header');
          return;
      }

      if (err.message === 'Missing Content-Type') {
          res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
          res.end('Missing Content-Type');
          return;
      }

      if (err.message.includes('Unsupported content type')) {
          res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
          res.end('Unsupported content type');
          return;
      }

      if (err.message === 'Chunk is out of range') {
          res.writeHead(400, 'Bad Request', { 'Content-Type': 'text/plain' });
          res.end('Chunk number must be between 0 and total chunks - 1 (0 indexed)');
          return;
      }

      if (err.message === 'File is above size limit') {
          res.writeHead(413, 'Payload Too Large', { 'Content-Type': 'text/plain' });
          res.end(`File is too large. Max fileSize is: ${maxFileSize}MB`);
          return;
      }

      if (err.message === 'Chunk is above size limit') {
          res.writeHead(413, 'Payload Too Large', { 'Content-Type': 'text/plain' });
          res.end(`Chunk is too large. Max chunkSize is: ${maxChunkSize}MB`);
          return;
      }

// this error is triggered if a chunk with uploader-chunk-number header != 0
      // is sent and there is no corresponding temp dir.
      // It means that the upload dir has been deleted in the meantime.
      // Although uploads should be resumable, you can't keep partial uploads for days on your server
      if (err && err.message === 'Upload has expired') {
          res.writeHead(410, 'Gone', { 'Content-Type': 'text/plain' });
          res.end(err.message);
          return;
      }

      // other FS errors
      res.writeHead(500, 'Internal Server Error'); // potentially saturated disk
      res.end();
  });
})
app.post('/uploadFile', upload.single('sampleFile'), async (req, res, next) => {
  const thePath = path.join(__dirname ,'sites','local',req.body.username,req.body.pagename);
  console.log(thePath);
  

  const file = req.file

  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
   try{
    await fse.removeSync(thePath);
   }catch(e){

   }
   let zipped = path.join(__dirname, file.path);
  fs.createReadStream(file.path).pipe(
    unzipper.Extract({ path: thePath })
  )
  // try {
  //  await fs.unlinkSync(file.path)
  //   //file removed
  // } catch(err) {
  //   console.error(err)
  // }
  res.send(file)
})
app.use(express.static(__dirname+'sites'))
app.get('/sites/:id/:file/:page', function (req, res) {
  var site = req.params.id
  var fil = req.params.file;
  var p = req.params.page;
  // var fileServer = new nStatic.Server(`./sites/${site}/${fil}`)
  // fileServer.serve(req, res);
  res.sendFile(path.join(__dirname, `sites/${site}/${fil}`, p?p:'index.html'))
})

app.use('/local', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true }));

app.use(
  '/api/',
  graphqlHTTP({
    schema: schema,
    rootValue: Root,
    graphiql: true
  })
)

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  // app.use(Secure);
  app.use(express.static(path.join(__dirname, 'client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
} else {
  app.use(express.static(path.join(__dirname, 'client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Listening on port ${port}`))
