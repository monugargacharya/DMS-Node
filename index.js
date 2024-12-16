require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let http = require('http')
const app = express();
var route = require('./routing/routing')
var corsOrigin = require('./middleware/cors')

  
app.use(cors());
app.use(bodyParser.json({
    limit: '100mb'
}),bodyParser.urlencoded({
        limit: '100mb',
        parameterLimit: 2000,
        extended: true
    })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});
app.use(route)

let server = http.createServer(app);
server.listen(process.env.SPort, ()=>{
  console.log('Server is running On this Port '+process.env.SPort);
})