module.exports = function(app) {
  require(__dirname + '/pointsCtrl')(app)
  require(__dirname + '/loginCtrl')(app)
}
