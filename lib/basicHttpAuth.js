var eat = require('eat')
var User = require(__dirname + '/../models/user')

module.exports = function(req, res, next) {
  try {
    var authString = req.headers.authorization;
    var basicString = authString.split(' ')[1]
    var basicBuffer = new Buffer(basicString, 'base64')
    var authArray = basicBuffer.toString().split(':')
    req.auth = {
      username: authArray[0],
      password: authArray[1]
    }
    next()
  } catch(err) {
    console.log(err)
    return res.status(401).json({
      msg: 'Cannot authenticate, I hate you.'
    })
  }
}
