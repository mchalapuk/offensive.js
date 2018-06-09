should = require "should"
mocha = require "mocha"
shouldThrow = require '../should-throw.coffee'

check = require "../.."

isDefined = (arg) -> not (typeof arg is "undefined")

describe "check(0, 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check 0, "arg"

  errorSet = [1, 2, 3]
  describe ".oneOf([1, 2, 3])", ->
    expectedMessage = "arg must be one of [1, 2, 3]; got 0"
    it "should throw new Error('#{expectedMessage}')" , ->
      shouldThrow expectedMessage, -> testedCheck.oneOf errorSet

  errorSetName = "a super number"
  describe ".oneOf([1, 2, 3], 'a super number')", ->
    expectedMessage = "arg must be #{errorSetName}; got 0"
    it "should throw new Error('#{expectedMessage}')" , ->
      shouldThrow expectedMessage, -> testedCheck.oneOf errorSet, errorSetName

  nonErrorSet = [1, 2, 3, 0]
  describe ".oneOf([1, 2, 3, 0])", ->
    it "should not throw" , -> testedCheck.oneOf nonErrorSet

describe "check('arg', 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check "arg", "arg"

  errorTests = [
    [ null, isDefined, "assertName must be a string; got null" ]
    [ "defined", undefined, "condition must be a function or an object; got undefined" ]
    [ "defined", isDefined, "arg must be an array; got 'arg'" ]
  ]

  errorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".eachElementIs(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.eachElementIs arg0, arg1

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
      it "should not throw" , -> testedCheck.eachElementIs arg0, arg1

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
      it "should not throw" , -> testedCheck.eachElementIs arg0, arg1

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
        shouldThrow expectedMessage, -> testedCheck.eachElementIs arg0, arg1

elementTypeTests = [
  [
    "onlyNumbers"
    [ 0, 1, 2 ],
    [ "0", "1", "2" ],
    "arg[0] must be a number; got #0 and "+
    "arg[1] must be a number; got #1 and "+
    "arg[2] must be a number; got #2"
  ]
  [
    "onlyStrings"
    [ "a", "b", "c" ]
    [ "'a'", "'b'", "'c'" ]
    "arg[0] must be a string; got #0 and "+
    "arg[1] must be a string; got #1 and "+
    "arg[2] must be a string; got #2"
  ]
  [
    "onlyObjects"
    [ {}, [], null ]
    [ "{}", "[]", "null" ]
    "arg[0] must be an object; got #0 and "+
    "arg[1] must be an object; got #1 and "+
    "arg[2] must be an object; got #2"
  ]
  [
    "onlyFunctions"
    [ (->), (->), (->) ]
    [ "unnamed function", "unnamed function", "unnamed function" ]
    "arg[0] must be a function; got #0 and "+
    "arg[1] must be a function; got #1 and "+
    "arg[2] must be a function; got #2"
  ]
]

elementTypeTests.forEach (params)->
  [ assertionName, array, got ] = params

  describe "check([#{got}])", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check array, "arg"

    describe ".#{assertionName}()", ->
      it "should not throw", -> testedCheck[assertionName]()

    errorTests = elementTypeTests.filter (test) -> not(test[0] is assertionName)
    errorTests.forEach (errorParams)->
      [ errorAssertionName, ignored0, ignored1, expectedMessage ] = errorParams
      expectedMessage = expectedMessage
        .replace(new RegExp("##{i}", "g"), "#{got[i]}") for i in [0..got.length]

      describe ".#{errorAssertionName}", ->
        it "should throw new Error('#{expectedMessage}')", ->
          shouldThrow expectedMessage, -> testedCheck[errorAssertionName]


describe "check([{}, {}, {}])", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check [ {}, {}, {} ], "arg"

  describe ".has.onlyInstancesOf(Object)",->
    it "should not throw", -> testedCheck.has.onlyInstancesOf Object

  describe ".has.onlyInstancesOf(String)",->
    expectedMessage = ""+
      "arg[0] must be an instance of String; got {} and "+
      "arg[1] must be an instance of String; got {} and "+
      "arg[2] must be an instance of String; got {}"
    it "should throw new Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedCheck.has.onlyInstancesOf String

