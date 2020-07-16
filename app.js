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



const port = process.env.PORT || 4000
var app = express()
app.use(cors())
const multer = require('multer')
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tempFiles/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.zip')
  }
})

var upload = multer({ storage: storage })


app.post('/uploadFile', upload.single('sampleFile'), async (req, res, next) => {
  const thePath = './sites/local/' + req.body.username+"/"+req.body.pagename;
  
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
  fs.createReadStream('./' + file.path).pipe(
    unzipper.Extract({ path: thePath })
  )
  try {
   await fs.unlinkSync(req.file.path)
    //file removed
  } catch(err) {
    console.error(err)
  }
  res.send(file)
})
// app.use(express.static(__dirname+'sites'))
// app.get('/sites/:id/:file/:page', function (req, res) {
//   var site = req.params.id
//   var fil = req.params.file;
//   var p = req.params.page;
//   // var fileServer = new nStatic.Server(`./sites/${site}/${fil}`)
//   // fileServer.serve(req, res);
//   res.sendFile(path.join(__dirname, `sites/${site}/${fil}`, p?p:'index.html'))
// })

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
