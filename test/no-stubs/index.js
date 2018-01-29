/* global describe, it */

const path = require('path')

const tBundle = require('../../index')

const { DemoFProxy } = require('../res/Demo').Demo

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

describe('tBundle', () => {
  it('client', done => {
    tBundle.initialize(path.join(process.env.TAF_PROD_CONFIG))
    let proxy = tBundle.stringToProxy(DemoFProxy, 'Nodejs.DemoServer.DemoObj@tcp -h 127.0.0.1 -t 60000 -p 17001')
    proxy.echo('foo').then(ret => {
      console.info('test response', ret.response.return)
      tBundle.destroy().then(done)
    }).catch(error => {
      console.error('test error', error)
      tBundle.destroy().then(done)
    })
  })
})
