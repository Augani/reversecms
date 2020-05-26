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
var nStatic = require('node-static')

const port = process.env.PORT || 4000
var app = express()
app.use(cors())
const multer = require('multer')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './file/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.zip')
  }
})

var upload = multer({ storage: storage })


app.post('/uploadFile', upload.single('sampleFile'), async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  fs.createReadStream('./' + file.path).pipe(
    unzipper.Extract({ path: './sites/' + file.filename.split('.')[0] })
  )
  res.send(file)
})
app.use(express.static(path.join(__dirname, `sites`)))
app.get('/sites/:id', function (req, res) {
  var site = req.params.id
  var fileServer = new nStatic.Server(`./sites/${site}`)
  // fileServer.serve(req, res);
  res.sendFile(path.join(__dirname, `sites/${site}`, 'detail_category.html'))
})

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
