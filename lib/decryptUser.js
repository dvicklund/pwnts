var eat = require('eat')
var User = require(__dirname + '/../models/user')

module.exports = function(req, res, next) {
  var token = req.headers.token
  var bodyToken = (req.body) ? req.body.token : ''
  token = token || bodyToken

  if(!token) {
    console.log('no token')
    return res.status(401).json({
      msg: 'Cannot authenticate, try again - I dare you.'
    })
  }

  eat.decode(token, process.env.APP_SECRET, function(err, decoded) {
    if(err) {
      console.log('decoding error, token invalid')
      console.log(err)
      return res.status(401).json({
        msg: 'Cannot authenticate, is your token expired?'
      })
    }

    User.findOne({_id: decoded.id}, function(err, user) {
      if(err) {
        console.log('user lookup error')
        console.log(err)
        return res.status(401).json({
          msg: 'Cannot authenticate, you slimeball.'
        })
      }

      if(!user) {
        console.log('user: ' + decoded.id + ' not found')
        console.log(err)
        return res.status(401).json({
          msg: 'Cannot authenticate, you amorphous pile of goo.'
        })
      }

      req.user = user
      
      next()
    })
  })
}
