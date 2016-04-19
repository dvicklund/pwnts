module.exports = function(app) {
  app.controller('PointsCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.user = {}

    function getUser() {
      $http.get('/')
    }
  }])
}
