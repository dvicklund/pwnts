var express = require('express')
var User = require(__dirname + '/../models/user')
var decryptUser = require(__dirname + '/../lib/decryptUser')
var handleError = require(__dirname + '/../lib/handleError')

var pointsRouter = module.exports = express.Router()

pointsRouter.put('/add/:num', decryptUser, function(req, res) {
  User.findOneAndUpdate({'_id': req.user._id}, {$inc: {'points': req.params.num}})
})

pointsRouter.put('/give/')
