module.exports = function(app) {
  app.controller('PwntsCtrl', ['$http', '$scope', '$cookies', '$location',
  function($http, $scope, $cookies, $location) {
    $scope.user = {}
    $scope.token = ''
    $scope.searchText = ''
    $scope.recUser = {}
    $scope.searchResults = []
    $scope.pointsAmt = 0
    $scope.recipient

    var apiUrl = 'http://localhost:3000'

    // Thanks, underscore!
		$scope.debounce = function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

    $scope.getUser = function() {
      $scope.token = $cookies.get('token')
      $http.defaults.headers.common.token = $scope.token
      $http.get(apiUrl + '/auth/user')
        .then(function(res) {
          $scope.user = res.data
        }, function(err) {
          $location.path('/login')
          console.log(err)
        })
    }

    $scope.givePoints = function() {
      $http.defaults.headers.common.token = $scope.token
      $http.put(apiUrl + '/points/add/' + $scope.pointsAmt)
        .then(function(res) {
          $location.path('/give')
          $scope.user.distributable = res.body.distributable
        }, function(err) {
          console.log(err)
        })
    }

    $scope.setRecipient = function(user) {
      $scope.recipient = user
      $location.path('/give')
    }

    $scope.findUser = $scope.debounce(function() {
      if($scope.searchText) {
        $scope.loading = true;
        $http({
          method: 'GET',
          url: apiUrl + '/points/user/' + $scope.searchText
        }).then(function(res) {
          $scope.searchResults = res.data
          $scope.loading = false
        }, function(err) {
          console.log('oops')
        })
      }
    }, 500)
  }])
}
