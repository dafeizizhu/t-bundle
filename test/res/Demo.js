const TModel = require('t-model')
const TafProtocolClient = require('t-rpc/lib/protocols/taf/client')
const { RpcError, ClientDecodeError, ServerFuncNotFoundError } = require('t-rpc/lib/util/rpc-error')
const ResponseMessage = require('t-rpc/lib/util/response-message')

class DemoStruct extends TModel.TStruct {
  static parse (value) {
    return Object.assign({}, {
      id: 0,
      name: '',
      list: null
    }, value)
  }
  static readFrom (is, tBuffer) {
    let id = (TModel.TInt32).read(is, 0, true)
    let name = (TModel.TString).read(is, 1, true)
    let list = (TModel.TList(TModel.TString)).read(is, 2, false)
    return new DemoStruct({
      id, name, list
    }).valueOf()
  }
  constructor (value) {
    super(value)

    this._t_id = new (TModel.TInt32)(this._value.id)
    this._t_name = new (TModel.TString)(this._value.name)
    this._t_list = new (TModel.TList(TModel.TString))(this._value.list)
  }

  get id () {
    return this._t_id.valueOf()
  }
  get name () {
    return this._t_name.valueOf()
  }
  get list () {
    return this._t_list.valueOf()
  }

  set id (value) {
    this._t_id = new (TModel.TInt32)(value)
  }
  set name (value) {
    this._t_name = new (TModel.TString)(value)
  }
  set list (value) {
    this._t_list = new (TModel.TList(TModel.TString))(value)
  }

  writeTo (os, tBuffer) {
    this._t_id.write(os, 0)
    this._t_name.write(os, 1)
    this._t_list.write(os, 2)
  }

  valueOf () {
    return {
      id: this._t_id.valueOf(),
      name: this._t_name.valueOf(),
      list: this._t_list.valueOf()
    }
  }
}

class DemoFProxy {
  static get Protocol () {
    return TafProtocolClient
  }
  constructor () {
    this._name = undefined
    this._objectProxy = undefined
  }
  setTimeout (value) {
    this._objectProxy.timeout = value
  }
  getTimeout () {
    return this._objectProxy.timeout
  }
  echo (str, ...args) {
    let _encode = () => {
      let os = new TModel.TOutputStream()
      new (TModel.TString)(str).write(os, 1)
      return os.tBuffer.buffer
    }
    let _decode = rpcResult => {
      try {
        let response = { arguments: {} }
        let is = new TModel.TInputStream(new TModel.TBuffer(rpcResult.responseMessage.responsePacket.sBuffer))
        response.costtime = rpcResult.costTime
        response.return = TModel.TString.read(is, 0, true)
        return { request: rpcResult.requestMessage, response }
      } catch (error) {
        let message = error.responseMessage ? error.responseMessage.message : error.message
        throw new ClientDecodeError(message, rpcResult.requestMessage, rpcResult.responseMessage, rpcResult.costTime, rpcResult.endpointInfo)
      }
    }
    let _error = rpcError => {
      let code = rpcError.responseMessage ? rpcError.responseMessage.code : -999
      let message = rpcError.responseMessage ? rpcError.responseMessage.message : rpcError.message
      throw new RpcError(code, message, rpcError.requestMessage, rpcError.responseMessage, rpcError.costTime, rpcError.endpointInfo)
    }
    return this._objectProxy.invoke('echo', _encode(), args.length > 0 ? args[0] : undefined).then(_decode, _error)
  }
  assemble (id, name, list, ...args) {
    let _encode = () => {
      let os = new TModel.TOutputStream()
      new (TModel.TInt32)(id).write(os, 1)
      new (TModel.TString)(name).write(os, 2)
      new (TModel.TList(TModel.TString))(list).write(os, 3)
      return os.tBuffer.buffer
    }
    let _decode = rpcResult => {
      try {
        let response = { arguments: {} }
        let is = new TModel.TInputStream(new TModel.TBuffer(rpcResult.responseMessage.responsePacket.sBuffer))
        response.costtime = rpcResult.costTime
        response.return = DemoStruct.read(is, 0, true)
        return { request: rpcResult.requestMessage, response }
      } catch (error) {
        let message = error.responseMessage ? error.responseMessage.message : error.message
        throw new ClientDecodeError(message, rpcResult.requestMessage, rpcResult.responseMessage, rpcResult.costTime, rpcResult.endpointInfo)
      }
    }
    let _error = rpcError => {
      let code = rpcError.responseMessage ? rpcError.responseMessage.code : -999
      let message = rpcError.responseMessage ? rpcError.responseMessage.message : rpcError.message
      throw new RpcError(code, message, rpcError.requestMessage, rpcError.responseMessage, rpcError.costTime, rpcError.endpointInfo)
    }
    return this._objectProxy.invoke('assemble', _encode(), args.length > 0 ? args[0] : undefined).then(_decode, _error)
  }
  replicate (name, list, count, ...args) {
    let _encode = () => {
      let os = new TModel.TOutputStream()
      new (TModel.TString)(name).write(os, 1)
      new (TModel.TList(TModel.TString))(list).write(os, 2)
      new (TModel.TInt32)(count).write(os, 3)
      return os.tBuffer.buffer
    }
    let _decode = rpcResult => {
      try {
        let response = { arguments: {} }
        let is = new TModel.TInputStream(new TModel.TBuffer(rpcResult.responseMessage.responsePacket.sBuffer))
        response.costtime = rpcResult.costTime
        response.return = TModel.TList(DemoStruct).read(is, 0, true)
        return { request: rpcResult.requestMessage, response }
      } catch (error) {
        let message = error.responseMessage ? error.responseMessage.message : error.message
        throw new ClientDecodeError(message, rpcResult.requestMessage, rpcResult.responseMessage, rpcResult.costTime, rpcResult.endpointInfo)
      }
    }
    let _error = rpcError => {
      let code = rpcError.responseMessage ? rpcError.responseMessage.code : -999
      let message = rpcError.responseMessage ? rpcError.responseMessage.message : rpcError.message
      throw new RpcError(code, message, rpcError.requestMessage, rpcError.responseMessage, rpcError.costTime, rpcError.endpointInfo)
    }
    return this._objectProxy.invoke('replicate', _encode(), args.length > 0 ? args[0] : undefined).then(_decode, _error)
  }
}

class DemoFServant {
  doRequest (requestMessage) {
    let { requestId, funcName, appBuffer } = requestMessage
    let is = new TModel.TInputStream(new TModel.TBuffer(appBuffer))
    let os = new TModel.TOutputStream()
    switch (funcName) {
      case 'echo': {
        let str = TModel.TString.read(is, 1, true)
        return this.echo(str).then(ret => {
          new (TModel.TString)(ret.return).write(os, 0)
          let responseMessage = new ResponseMessage({
            requestId,
            code: 0,
            message: 'success',
            responsePacket: {
              iMessageType: 0,
              sBuffer: os.tBuffer.buffer,
              context: requestMessage.context || {}
            }
          })
          return Promise.resolve({ responseMessage })
        }).catch(error => {
          let code = error.code ? error.code : -999
          let message = error.message || 'unknown error'
          let rpcError = new RpcError(code, message, requestMessage, null, 0, null)
          return Promise.reject(rpcError)
        })
      }
      case 'assemble': {
        let id = TModel.TInt32.read(is, 1, true)
        let name = TModel.TString.read(is, 2, true)
        let list = TModel.TList(TModel.TString).read(is, 3, true)
        return this.assemble(id, name, list).then(ret => {
          new (DemoStruct)(ret.return).write(os, 0)
          let responseMessage = new ResponseMessage({
            requestId,
            code: 0,
            message: 'success',
            responsePacket: {
              iMessageType: 0,
              sBuffer: os.tBuffer.buffer,
              context: requestMessage.context || {}
            }
          })
          return Promise.resolve({ responseMessage })
        }).catch(error => {
          let code = error.code ? error.code : -999
          let message = error.message || 'unknown error'
          let rpcError = new RpcError(code, message, requestMessage, null, 0, null)
          return Promise.reject(rpcError)
        })
      }
      case 'replicate': {
        let name = TModel.TString.read(is, 1, true)
        let list = TModel.TList(TModel.TString).read(is, 2, true)
        let count = TModel.TInt32.read(is, 3, true)
        return this.replicate(name, list, count).then(ret => {
          new (TModel.TList(DemoStruct))(ret.return).write(os, 0)
          let responseMessage = new ResponseMessage({
            requestId,
            code: 0,
            message: 'success',
            responsePacket: {
              iMessageType: 0,
              sBuffer: os.tBuffer.buffer,
              context: requestMessage.context || {}
            }
          })
          return Promise.resolve({ responseMessage })
        }).catch(error => {
          let code = error.code ? error.code : -999
          let message = error.message || 'unknown error'
          let rpcError = new RpcError(code, message, requestMessage, null, 0, null)
          return Promise.reject(rpcError)
        })
      }
      default:
        return Promise.reject(new ServerFuncNotFoundError(funcName + ' not found', requestMessage, null, 0, null))
    }
  }
  echo (str) {
    let ret = {}
    ret.return = ''
    return Promise.resolve(ret)
  }
  assemble (id, name, list) {
    let ret = {}
    ret.return = null
    return Promise.resolve(ret)
  }
  replicate (name, list, count) {
    let ret = {}
    ret.return = null
    return Promise.resolve(ret)
  }
}

exports.Demo = exports.Demo || {}
exports.Demo.DemoStruct = DemoStruct
exports.Demo.DemoFProxy = DemoFProxy
exports.Demo.DemoFServant = DemoFServant
