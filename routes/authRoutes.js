var express = require('express')
var User = require(__dirname + '/../models/user')
var decryptUser = require(__dirname + '/../lib/decryptUser')
var handleError = require(__dirname + '/../lib/handleError')
var basicHttp = require(__dirname + '/../lib/basicHttpAuth')

var authRouter = module.exports = express.Router()

authRouter.post('/signup', function(req, res) {
  User.findOne({'auth.basic.username': req.body.auth.basic.username}, function(err, foundUser) {
    if(!foundUser) {
      var user = new User()
      user.auth.basic.username = req.body.auth.basic.username
      user.username = req.body.auth.basic.username
      user.firstName = req.body.firstName
      user.lastName = req.body.lastName
      user.email = req.body.email

      user.hashPW(req.body.auth.basic.password)

      user.save(function(err, savedUser) {
        if(err) return handleError(err, res)
        savedUser.genToken(function(err, token) {
          res.json({token: token})
        })
      })
    } else {
      res.status(401).json({msg: 'User already exists!'})
    }
  })
})

authRouter.post('/signin', basicHttp, function(req, res) {
  if(!(req.auth.username && req.auth.password)) {
    console.log('no authentication found on request')
    return res.status(401).json({
      msg: 'Authentication failed'
    })
  }

  User.findOne({'auth.basic.username': req.auth.username}, function(err, foundUser) {
    if(err) {
      console.log('user lookup error')
      console.log(err)
      return res.status(401).json({
        msg: 'Authentication failed!  DB lookup error'
      })
    }

    if(!foundUser) {
      console.log('user: ' + req.auth.username + ' not found')
      return res.status(401).json({
        msg: 'User not found!'
      })
    }

    if(!foundUser.checkPW(req.auth.password)) {
      console.log('incorrect password provided')
      return res.status(401).json({
        msg: 'Incorrect password'
      })
    }

    foundUser.genToken(function(err, token) {
      res.set('token', token)
      res.json({token: token})
    })
  })
})

authRouter.get('/user', decryptUser, function(req, res) {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    distributable: req.user.distributable,
    points: req.user.points
  });
})

authRouter.put('/user', decryptUser, function(req, res) {
  User.findOneAndUpdate({'_id': req.user._id}, req.body, {new: true},
    function(err, foundUser) {
      if(err) res.status(401).json({msg: 'Query unsuccessful!\n' + err})
      res.json({
        user: foundUser,
        msg: 'Successfully updated ' + foundUser.username + '\'s info'
      })
    })
})

authRouter.delete('/user', decryptUser, function(req, res) {
  User.findOneAndRemove({'_id': req.user._id}, function(err, foundUser) {
    if(err) res.status(401).json({msg: 'Could not remove user!  WTF?!'})
    if(!foundUser) res.status(401).json({msg: 'Can\'t remove nonexistent user'})
    res.json({
      msg: foundUser.username + ' deleted'
    })
  })
})
