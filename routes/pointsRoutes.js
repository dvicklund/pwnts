var express = require('express')
var User = require(__dirname + '/../models/user')
var decryptUser = require(__dirname + '/../lib/decryptUser')
var handleError = require(__dirname + '/../lib/handleError')

var pointsRouter = module.exports = express.Router()

pointsRouter.put('/add/:num', decryptUser, function(req, res) {
  User.findOneAndUpdate({'_id': req.user._id}, {$inc: {'distributable': req.params.num}}, {new: true}, function(err, data) {
    if(err) handleError(err, res);
    res.json({
      distributable: data.distributable
    })
  })
})

pointsRouter.put('/give/:num/:user', decryptUser, function(req, res) {
  User.findOneAndUpdate({'username': req.params.user}, {
    $inc: {'points': req.params.num},
    $push: {'pointsReceived': {
      'giver': req.user._id,
      'points': req.params.num
    }}
  }, {new: true}, function(err, receiver) {
    if(err) handleError(err, res)
    User.findOneAndUpdate({'_id': req.user._id}, {
      $inc: {'distributable': -req.params.num},
      $push: {'pointsGiven': {
        'recipient': receiver._id,
        'points': req.params.num
      }}
    }, {new: true}, function(err, giver) {
      if(err) handleError(err, res)
      res.json({
        distributable: giver.distributable,
        pointsGiven: giver.pointsGiven
      })
    })
  })
})

pointsRouter.get('/user/:query', function(req, res) {
  var searchTerm = new RegExp(req.params.query, 'i')
  User.find({fullName: searchTerm}, 'username fullName', function(err, users) {
    if(err) res.send(err)
    res.json(users)
  })
})
