'use strict'

describe('Unsubscribe NATS topic', function () {
  var PORT = 6242
  var flags = ['--user', 'derek', '--pass', 'foobar']
  var authUrl = 'nats://derek:foobar@localhost:' + PORT
  var server

  // Start up our own nats-server
  before(function (done) {
    server = HemeraTestsuite.start_server(PORT, flags, done)
  })

  // Shutdown our server after we are done
  after(function () {
    server.kill()
  })

  it('Should be able to unsubscribe a NATS topic', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add({
        topic: 'math',
        cmd: 'add'
      }, (resp, cb) => {
        cb(null, {
          result: resp.a + resp.b
        })
      })

      const result = hemera.remove('math')
      expect(hemera.topics.math).to.be.not.exists()
      expect(result).to.be.equals(true)
      hemera.close()
      done()
    })
  })

  it('Should return false when topic was not found', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      hemera.add({
        topic: 'math',
        cmd: 'add'
      }, (resp, cb) => {
        cb(null, {
          result: resp.a + resp.b
        })
      })

      const result = hemera.remove('math1')
      expect(hemera.topics.math1).to.be.not.exists()
      expect(result).to.be.equals(false)
      hemera.close()
      done()
    })
  })
})