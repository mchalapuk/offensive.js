should = require "should"
mocha = require "mocha"

check = require "../.."

shouldThrow = (expectedMessage, test)->
  try
    test()

    true.should.be.false "exception not thrown"
  catch e
    throw e unless e.message is expectedMessage

isDefined = (arg) -> not (typeof arg is "undefined")

describe "check('arg', 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check "arg", "arg"

  errorTests = [
    [ null, isDefined, 'assertName must be a string; got null' ]
    [ "defined", undefined, 'assertFunction must be a function; got undefined' ]
    [ "defined", isDefined, 'arg must be an array; got arg' ]
  ]

  errorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".eachElementIs(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.eachElementIs(arg0, arg1)

describe "check([], 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check [], "arg"

  tests = [
    [ "defined", isDefined ]
  ]

  tests.forEach (params) ->
    [ arg0, arg1] = params

    describe ".eachElementIs(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should not throw" , -> testedCheck.eachElementIs(arg0, arg1)

isString = (arg) -> typeof arg is "string"
isNumber = (arg) -> typeof arg is "number"
isFibonacci = (current, next, limit, arg) ->
  return true if current is arg
  return false if current > limit
  return isFibonacci next, current + next, limit, arg

describe "check([0, 8, 14], 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check [0, 8, 14], "arg"

  tests = [
    [ "a number", isNumber ]
    [ "defined", isDefined ]
  ]

  tests.forEach (params) ->
    [ arg0, arg1] = params

    describe ".eachElementIs(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should not throw" , -> testedCheck.eachElementIs(arg0, arg1)

  errorTests = [
    [
      "a string"
      isString
      "arg[0] must be a string; got 0 and "+
      "arg[1] must be a string; got 8 and "+
      "arg[2] must be a string; got 14"
    ]
    [
      "a fibonacci number"
      isFibonacci.bind(null, 0, 1, 20)
      "arg[2] must be a fibonacci number; got 14"
    ]
  ]

  errorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".eachElementIs(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.eachElementIs(arg0, arg1)

