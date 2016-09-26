var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var eat = require('eat')

var userSchema = new mongoose.Schema({
  auth: {
    basic: {
      username: String,
      password: String
    }
  },
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  fullName: String,
  displayPhoto: {type: String, default: ''},
  locationCity: String,
  locationState: String,
  zip: Number,
  points: {type: Number, default: 0},
  distributable: {type: Number, default: 20},
  pointsGiven: [{
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    points: Number
  }],
  pointsReceived: [{
    giver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    points: Number
  }]
})

userSchema.methods.hashPW = function(pw) {
  var hash = this.auth.basic.password = bcrypt.hashSync(pw, 8)
  return hash;
}

userSchema.methods.checkPW = function(pw) {
  return bcrypt.compareSync(pw, this.auth.basic.password)
}

userSchema.methods.genToken = function(cb) {
  var id = this._id
  eat.encode({id: id}, process.env.APP_SECRET, cb)
}

module.exports = mongoose.model('User', userSchema)
