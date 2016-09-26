module.exports = function(app) {
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'html/pwnts.html',
      controller: 'PwntsCtrl'
    })
    .when('/login', {
      templateUrl: 'html/login.html',
      controller: 'LoginCtrl'
    })
    .when('/give', {
      templateUrl: 'html/pwnts.html',
      controller: 'PwntsCtrl'
    })
  }])
}
