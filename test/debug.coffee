Function.prototype.toJSON = -> @name

stack = ""
indent = "      "

log = (arg) -> console.log "#{stack}#{indent}#{arg}"
pass = (arg) -> arg

debug = {
  function: (instance, func, name)->
    (args...) ->
      log "#{name}(#{args.map(JSON.stringify).join(',')})"
      indent += "  "
      retVal = func.apply instance, args
      if retVal is instance
        log "return this"
      else
        log "return #{JSON.stringify(retVal)}"
      indent = indent.substr 0, indent.length - 2
      retVal

  method: (instance, key, prefix = '#', suffix = '')->
    instance[key] = debug.function instance, instance[key], "#{prefix}#{key}#{suffix}"

  property: (instance, key,onSet = pass)->
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

  state: (checkState) ->
    debug.method checkState, 'strategy', checkState.strategy.name
    debug.property checkState, 'strategy', (value)->
      debug.function checkState, value, "#strategy[#{value.name}]"
    debug.property checkState, 'result'
    debug.method checkState.done, 'push', 'done.'

  check: (testedCheck) ->
    debug.property testedCheck, 'finish'
    debug.state testedCheck.state
    debug.property testedCheck, 'state'
    debug.property testedCheck, 'current'

    testedCheck.push = debug.decorate testedCheck.push, (originalPush)->
      stack += "|"
      indent = indent.substr 1
      retVal = originalPush.call testedCheck
      debug.state testedCheck.state
      retVal
    testedCheck.pop = debug.decorate testedCheck.pop, (originalPop)->
      indent += " "
      stack = stack.substr 1
      originalPop.call testedCheck

    debug.method testedCheck, 'add'
    debug.method testedCheck, 'assert'
    testedCheck
}

module.exports = debug

