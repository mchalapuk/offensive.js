should = require "should"
shouldThrow = require "../should-throw.coffee"

check = require "../../offensive"
Type = require "../../lib/utils/Type"

describe "check(undefined, \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check undefined, 'arg'

  describe ".property(\"name\", \"value\")", ->

    expectedMessage = "arg must be not empty; got undefined"
    it "should throw new Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedCheck.property "name", "value"

  describe ".method(\"name\", \"value\")", ->

    expectedMessage = "arg must be not empty; got undefined"
    it "should throw new Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedCheck.property "name", "value"

describe "check({ \"undefined\": undefined }, \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check { undefined: undefined }, 'arg'

  describe ".property(\"undefined\")", ->
    it "should not throw", -> testedCheck.property "undefined"

describe "check(\"arg\", \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check 'arg', 'arg'

  errorTests = [
    [ null, 'value', 'propertyName must be a string; got null' ]
    [ 'defined', undefined, 'arg.defined must be not undefined; got undefined' ]
    [ 'length', 0, 'arg.length must be 0; got 3' ]
  ]

  errorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".property(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.property arg0, arg1

  tests = [
    [ "charAt", undefined ]
    [ "length", 3 ]
  ]

  tests.forEach (params)->
    [ arg0, arg1 ] = params

    describe ".property(\"#{arg0}\", \"#{arg1}\")", ->
      it "should not throw", -> testedCheck.property arg0, arg1

  describe ".method(\"charAt\")", ->
    it "should not throw", -> testedCheck.method "charAt"

  methodErrorTests = [
    [ 'length', 'arg.length must be a function; got 3' ]
    [ 'concentrate', 'arg.concentrate must be a function; got undefined' ]
  ]

  methodErrorTests.forEach (params) ->
    [ arg0, expectedMessage] = params

    describe ".method(#{JSON.stringify(arg0)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.method arg0

  propTypeErrorTests = [
    [ null, Type.STRING, 'propertyName must be a string; got null' ]
    [ 'length', 0, 'propertyType must be one of [\'boolean\', \'number\', \'string\', \'object\', \'function\', \'undefined\']; got 0' ]
    [ 'length', Type.STRING, 'arg.length must be a string; got 3' ]
    [ 'length', Type.UNDEFINED, 'arg.length must be undefined; got 3' ]
    [ 'length', Type.BOOLEAN, 'arg.length must be a boolean; got 3' ]
  ]
  propTypeErrorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".propertyOfType(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.propertyOfType arg0, arg1

  describe ".propertyOfType('length', 'number')", ->
    it "should not throw" , -> testedCheck.propertyOfType "length", "number"

