var mongoose = require('mongoose')
var chai = require('chai')
chai.use(require('chai-http'))
var expect = chai.expect
var request = chai.request

process.env.MONGOLAB_URI = 'mongodb://localhost/test'
require(__dirname + '/../server')

describe('api routes', function() {
  var token, userID, token2, token3

  before(function(done) {
    request('localhost:3000')
    .post('/auth/signup')
    .send({
      auth: {
        basic: {
          username: 'dvick',
          password: 'pw1234'
        }
      },
      firstName: 'David',
      lastName: 'McTesterson',
      email: 'dada@test.com'
    })
    .end(function(err, res) {
      if(err) console.log(err.toString())
      token = res.body.token

      request('localhost:3000')
      .post('/auth/signup')
      .send({
        auth: {
          basic: {
            username: 'brick',
            password: 'pw1234'
          }
        },
        firstName: 'Troy',
        lastName: 'McClure',
        email: 'gravy@test.com'
      })
      .end(function(err, res) {
        if(err) console.log(err.toString())
        token2 = res.body.token

        request('localhost:3000')
        .post('/auth/signup')
        .send({
          auth: {
            basic: {
              username: 'brick2',
              password: 'pw1234'
            }
          },
          firstName: 'James',
          lastName: 'Avery',
          email: 'gravybones@test.com'
        })
        .end(function(err, res) {
          if(err) console.log(err.toString())
          token3 = res.body.token
          done()
        })
      })
    })
  })

  describe('authentication routes', function() {
    it('should create a new user', function() {
      expect(token).to.be.a('string')
    })

    it('should reject signup requests with existing username', function(done) {
      request('localhost:3000')
      .post('/auth/signup')
      .send({
        auth: {
          basic: {
            username: 'dvick',
            password: 'pw1234'
          }
        },
        firstName: 'David',
        lastName: 'McTesterson',
        email: 'dada@test.com'
      })
      .end(function(err, res) {
        expect(err.toString()).to.eql('Error: Unauthorized')
        expect(res.body.msg).to.eql('User already exists!')
        done()
      })
    })

    it('should log in a user', function(done) {
      request('localhost:3000')
      .post('/auth/signin')
      .auth('dvick', 'pw1234')
      .end(function(err, res) {
        expect(res.body.token).to.be.a('string')
        done()
      })
    })

    it('should get user info', function(done) {
      request('localhost:3000')
      .get('/auth/user')
      .set('token', token)
      .end(function(err, res) {
        expect(res.body).to.exist
        expect(res.body.username).to.eql('dvick')
        expect(res.body.distributable).to.eql(20)
        expect(res.body.points).to.eql(0)
        userID = res.body._id
        done()
      })
    })

    it('should update a user', function(done) {
      request('localhost:3000')
      .put('/auth/user')
      .set('token', token)
      .send({
        email: 'dodo@test.com'
      })
      .end(function(err, res) {
        expect(res.body.user).to.have.property('email')
        expect(res.body.user.email).to.eql('dodo@test.com')
        expect(res.body.user.username).to.eql('dvick')
        done()
      })
    })

    it('should delete a user', function(done) {
      request('localhost:3000')
      .delete('/auth/user')
      .set('token', token3)
      .end(function(err, res) {
        expect(res.body.msg).to.eql('brick2 deleted')
        done()
      })
    })
  })

  describe('points router', function() {
    it('should increase distributable points', function(done) {
      request('localhost:3000')
      .put('/points/add/20')
      .set('token', token)
      .end(function(err, res) {
        expect(res.body.distributable).to.eql(40)
        done()
      })
    })

    it('should be able to transfer points', function(done) {
      request('localhost:3000')
      .put('/points/give/1/brick')
      .set('token', token)
      .end(function(err, res) {
        expect(res.body.distributable).to.eql(39)
        expect(res.body.pointsGiven.length).to.eql(1)
        done()
      })
    })
  })

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done()
    })
  })
})
