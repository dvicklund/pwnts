// describe('scoreboard', function() {
//   it('should get the top ten scores', function() {
//     browser.get('http://localhost:8080/scoreboard')
//
//     element(by.model('scores')).click();
//   })
//
//   it('should display top ten scores', function() {
//
//   })
//
//   it('should find user\'s place in scores', function() {
//
//   })
// })

describe('container index.html', function() {
  it('should have title PWNTS!@!', function() {
    browser.get('http://localhost:8080')
    expect(browser.getTitle()).toEqual('PWNTS!@!')
  })
})
