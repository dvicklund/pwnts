module.exports = function(app) {
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {

    })
    .when('/login', {
      templateUrl: 'html/login.html',
      controller: 'LoginCtrl'
    })
  }])
}
