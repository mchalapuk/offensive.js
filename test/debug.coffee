Function.prototype.toJSON = -> @name

stack = ""
indent = "      "

log = (arg) -> console.log "#{stack}#{indent}#{arg}"
pass = (arg) -> arg

debug = {
  call: (instance, key, prefix = '#', suffix = '')->
    method = instance[key]
    instance[key] = (args...) ->
      log "#{prefix}#{key}#{suffix}(#{args.map(JSON.stringify).join(',')})"
      indent += "  "
      retVal = method.call instance, args...
      indent = indent.substr 0, indent.length - 2
      if retVal is instance
        log "return this"
      else
        log "return #{JSON.stringify(retVal)}"
      retVal

  property: (instance, key, onSet = pass)->
    value = instance[key]
    Object.defineProperty instance, key,
      get: ->
        value
      set: (arg)->
        log "set #{key}: #{JSON.stringify arg}"
        value = onSet arg
      enumerable: true,
      configurable: true,

  decorate: (originalFunction, decorator) ->
    (args...)-> decorator.call null, originalFunction, args...

  check: (testedCheck) ->
    debug.property testedCheck, 'finish'
    debug.property testedCheck, 'state'
    debug.property testedCheck.state, 'strategy', (value)->
      debug.call { strategy: value }, 'strategy'
    debug.property testedCheck.state, 'result'
    debug.property testedCheck.state, 'current'
    debug.call testedCheck.state.done, 'push', 'done.'
    testedCheck.push = debug.decorate testedCheck.push, (originalPush)->
      stack += "|"
      indent = indent.substr 1
      retVal = originalPush.call testedCheck
      debug.property testedCheck.state, 'strategy', (value)->
        debug.call { strategy: value }, 'strategy', '#', "[#{value.name}]"
      debug.property testedCheck.state, 'result'
      debug.property testedCheck.state, 'current'
      debug.call testedCheck.state.done, 'push', 'done.'
      retVal
    testedCheck.pop = debug.decorate testedCheck.pop, (originalPop)->
      indent += " "
      stack = stack.substr 1
      originalPop.call testedCheck
    testedCheck.add = debug.decorate testedCheck.add, (originalAdd, args...)->
      try
        originalAdd.call testedCheck, args...
      catch e
        console.error e.stack
        throw e

    debug.call testedCheck, 'add'
    debug.call testedCheck, 'assert'
    testedCheck
}

module.exports = debug

