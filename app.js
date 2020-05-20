require('dotenv').config()
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql')
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const Root = require('./api/resolvers');
const fs  = require('fs')
const schema = require('./api/schema');
const unzipper = require('unzipper')
const mongoose  = require('./api/Database');
const path  = require('path')

const port = process.env.PORT || 4000;
var app = express();
app.use(cors());
const multer = require('multer');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()); 

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, './file/')
  },
  filename: function (req, file, cb) {
    
    cb(null, Date.now()+'.zip')
  }
})
 
var upload = multer({ storage: storage })

app.post('/uploadFile', upload.single('sampleFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  // fs.createReadStream('./'+file.path)
  // .pipe(unzipper.Extract({ path: './file/'+ }));
  //   
  res.send(file)
})





app.use('/api/', graphqlHTTP({
  schema: schema,
  rootValue: Root,
  graphiql: true,
}));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  // app.use(Secure);
  app.use(express.static(path.join(__dirname, 'client/build')));

    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}else{
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}



app.listen(port, () => console.log(`Listening on port ${port}`));
