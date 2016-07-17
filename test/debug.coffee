Function.prototype.toJSON = -> @name

debug = {
  call: (instance, key)->
    method = instance[key]
    instance[key] = (args...) ->
      console.log "call #{key}(#{args.map(JSON.stringify).join(',')})"
      method.call instance, args...

  property: (instance, key)->
    value = instance[key]
    Object.defineProperty instance, key,
      get: ->
        value
      set: (arg)->
        console.log "set #{key}: #{JSON.stringify arg}"
        value = arg
      enumerable: true,
      configurable: true,

  decorate: (originalFunction, decorator) ->
    (args...)-> decorator.call null, originalFunction, args...

  check: (testedCheck) ->
    debug.property testedCheck, 'finish'
    debug.property testedCheck, 'state'
    debug.property testedCheck.state, 'strategy'
    debug.property testedCheck.state, 'result'
    debug.property testedCheck.state, 'current'
    debug.call testedCheck.state.done, 'push'
    testedCheck.push = debug.decorate testedCheck.push, (originalPush)->
      originalPush.call testedCheck
      debug.property testedCheck.state, 'strategy'
      debug.property testedCheck.state, 'result'
      debug.property testedCheck.state, 'current'
      debug.call testedCheck.state.done, 'push'
    testedCheck.add = debug.decorate testedCheck.add, (originalAdd, args...)->
      try
        originalAdd.call testedCheck, args...
      catch e
        console.error e.stack
        throw e

    debug.call testedCheck, 'add'
    debug.call testedCheck, 'push'
    debug.call testedCheck, 'pop'
    debug.call testedCheck, 'assert'
    testedCheck
}

module.exports = debug

