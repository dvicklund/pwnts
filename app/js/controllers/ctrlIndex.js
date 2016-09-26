module.exports = function(app) {
  require(__dirname + '/pwntsCtrl')(app)
  require(__dirname + '/loginCtrl')(app)
}
