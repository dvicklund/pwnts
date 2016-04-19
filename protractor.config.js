exports.config = {
  seleniumServerJar: __dirname + '/node_modules/protractor/selenium/selenium-server-standalone-2.53.0.jar',

  // seleniumAddress: 'http:localhost:4444',

  capabilities: {
    'browserName': 'chrome'
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 10000
  }
}
