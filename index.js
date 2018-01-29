const { TConfig } = require('t-util')
const { TClient, TServer } = require('t-rpc')
const TStat = require('t-stat')

exports.tConfig = null
exports.tClient = null
exports.tStat = null

let inited = false
let servers = []

exports.initialize = options => {
  if (inited) return

  inited = true

  if (options instanceof TConfig) exports.tConfig = options
  else if (typeof options === 'string') exports.tConfig = TConfig.parseFile(options)

  if (!exports.tConfig) throw new Error('options must be a TConfig instance or filePath')

  exports.tClient = new TClient(exports.tConfig)
  exports.tStat = new TStat(exports.tClient, exports.tConfig)
  exports.tClient.on('response', ({ rpcResult, rpcError }) => {
    let r = rpcResult || rpcError
    let e = rpcError
    if (r.requestMessage.packetType === 1) return

    try {
      let masterName = exports.tConfig.data.taf.application.client.modulename
      let slaveName = r.requestMessage.servantName.split('.').slice(0, 2).join('.')
      let interfaceName = r.requestMessage.funcName
      let masterIp = exports.tConfig.data.taf.application.server.localip
      let slaveIp = r.endpointInfo.host
      let slavePort = r.endpointInfo.port
      let bFromClient = true
      let headers = { masterName, slaveName, interfaceName, masterIp, slaveIp, slavePort, bFromClient }
      let code = e ? e.code : r.responseMessage.code
      let type = code === 0 ? TStat.TYPE.SUCCESS : TStat.TYPE.ERROR
      let time = r.costTime || 0
      exports.tStat.report(headers, type, time)
    } catch (error) {
      console.warn('get headers fail', error)
    }
  })

  exports.createServer = () => {
    let server = new TServer(exports.tConfig)
    servers.push(server)
    return server
  }
  exports.stringToProxy = (servant, objName) => exports.tClient.stringToProxy(servant, objName, '')
}

exports.destroy = () => {
  if (!inited) return

  inited = false

  return exports.tStat.destroy().then(() => {
    exports.tClient.destroy()
    return Promise.all(servers.map(server => server.stop()))
  }).then(() => {
    exports.tConfig = null
    exports.tClient = null
    exports.tStat = null
    exports.createServer = null
    exports.stringToProxy = null
    return Promise.resolve()
  })
}
