'use strict'

function myPlugin (options) {
  var hemera = this

  hemera.add({
    topic: 'math',
    cmd: 'add'
  }, (resp, cb) => {
    cb(null, resp.a + resp.b)
  })
}

const Hemera = require('./../packages/hemera')
const nats = require('nats').connect()

const hemera = new Hemera(nats, {
  logLevel: 'info',
  childLogger: true
})
hemera.expose('somethingToExpose', 4)
hemera.use({
  plugin: myPlugin,
  attributes: {
    name: 'myPlugin',
    dependencies: []
  },
  options: {}
})

hemera.ready(() => {
  // now you can use the plugin
})
