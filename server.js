var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()   // Front-end server
var api = express()   // Back-end server

process.env.APP_SECRET = process.env.APP_SECRET || 'suchmysteryCHANGEME'

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pwnts')

//-----------------------------------------------------------//

var authRouter = require(__dirname + '/routes/authRoutes')
var pointsRouter = require(__dirname + '/routes/pointsRoutes')

api.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, token');
  next();
})

api.use(bodyParser.json())
api.use('/auth', authRouter)
api.use('/points', pointsRouter)

api.listen(3000, function() {
  console.log('api listening on port 3000')
})

//-----------------------------------------------------------//

app.use(express.static(__dirname + '/build'))

app.listen(8080, function() {
  console.log('server listening on port 8080')
})
