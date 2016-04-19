module.exports = function(app) {
  app.controller('LoginCtrl', ['$rootScope', '$scope', '$timeout', '$location', '$http', '$cookies', '$base64', function($rootScope, $scope, $timeout, $location, $http, $cookies, $base64) {
    $scope.authErrors = []
    $scope.user = {}
    $scope.signup = false
    $scope.token = ''
    $scope.currentUser = null

    var apiUrl = 'http://localhost:3000'

    function isLoggedIn() {
      $cookies.get('token') ? true : false
    }

    function checkAuth() {
      if(!(isLoggedIn())) $location.path('/login')
    }

    $scope.toggleSignup = function() {
      $scope.signup ? $scope.signup = false : $scope.signup = true;
      $scope.authErrors = []
      $scope.user = {}
    }

    $scope.getUser = function() {
      $scope.token = $cookies.get('token')
      $http.defaults.headers.common.token = $scope.token
      $http.get(apiUrl + '/auth/user')
        .then(function(res) {
          $scope.currentUser = res.data
        }, function(err) {
          console.log(err)
        })
    }

    $scope.authenticate = function(user) {
      $scope.authErrors = [];

      debugger;

      if(!(user.auth.basic.username && user.auth.basic.password)) return $scope.authErrors.push('Please enter a username and password')

      if($scope.signup) {
        $http.post(apiUrl + '/auth/signup', user)
          .then(function(res) {
            $cookies.put('token', res.data.token)
            $scope.getUser()
            $scope.user = {}
            $scope.signup = false
            $location.path('/')
          }, function(err) {
            $scope.authErrors.push(err.data.msg)
            console.log(err.data)
            $scope.user = {}
          })
      } else {
        $http({
          method: 'POST',
          url: apiUrl + '/auth/signin',
          headers: {
            'Authorization': 'Basic ' + $base64.encode(user.auth.basic.username + ':' + user.auth.basic.password)
          }
        }).then(function(res) {
          $cookies.put('token', res.data.token)
          $scope.getUser()
          $scope.user = {}
          $location.path('/')
        }, function(err) {
          $scope.authErrors.push(err.data.msg)
          console.log(err.data)
          $scope.user = {}
        })
      }
    }

    $scope.logout = function() {
      $scope.currentUser = null
      $scope.user = {}
      $scope.user.auth = null
      $scope.signup = false
      $location.path('/login')
      $cookies.remove('token')
    }

    $scope.goto = function(path) {
      $location.path(path)
    }
  }])
}
