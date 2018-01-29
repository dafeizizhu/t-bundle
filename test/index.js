/* global describe, it */

const path = require('path')

const tBundle = require('../index')

describe('tBundle', () => {
  it('test', () => {
    tBundle.initialize(path.join(__dirname, 'Prod.Video.UploadStatusServer.config.conf'))

    console.info(tBundle)
  })
})
