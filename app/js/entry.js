require('angular')
require('angular-base64')
require('angular-cookies')
require('angular-route')

var app = angular.module('pwnts', [
  'ngRoute',
  'ngCookies',
  'base64'
])

require(__dirname + '/controllers/ctrlIndex')(app)
require(__dirname + '/directives/dirIndex')(app)
require(__dirname + '/router')(app)
