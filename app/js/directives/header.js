module.exports = function(app) {
  app.directive('header', function() {
    return {
      restrict: 'AC',
      replace: false,
      controller: 'PwntsCtrl',
      templateUrl: 'html/header.html'
    }
  })
}