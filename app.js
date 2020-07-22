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



const port = process.env.PORT || 4000
var app = express()
app.use(cors())
const multer = require('multer')
app.use(bodyParser.json({limit: "250mb"}));
app.use(bodyParser.urlencoded({limit: "250mb", extended: true, parameterLimit:250000}));
// app.use(function(req, res, next){
//   req.setTimeout(810480000, function(){ // 4 minute timeout adjust for larger uploads
//       console.log('Request has timed out.');
//           res.send(408);
//       });

//   next();
// });


function setConnectionTimeout(time) {
  var delay = typeof time === 'string'
    ? ms(time)
    : Number(time || 5000);

  return function (req, res, next) {
    res.connection.setTimeout(delay);
    next();
  }
}
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



app.post('/uploadFile',setConnectionTimeout('12h'), upload.single('sampleFile'), async (req, res, next) => {
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
