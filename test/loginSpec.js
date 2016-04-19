// module.exports = (function() {
// })

describe('login page', function() {
  beforeAll(angular.mock.module('pwnts'))
  beforeAll(angular.mock.inject(function($controller) {
    loginCtrl = $controller('LoginCtrl')
  }))

  it('should initialize login control', function() {
    expect(typeof loginCtrl).toBe('object')
    expect(typeof loginCtrl.user).toBe('object')
    expect(typeof loginCtrl.getUser).toBe('function')
  })

  it('should bind to $scope.user', function() {

  })

  it('should create a user', function() {

  })

  it('should log in existing user', function() {

  })
})
