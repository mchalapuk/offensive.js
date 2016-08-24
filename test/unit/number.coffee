should = require "should"
mocha = require "mocha"
shouldThrow = require "../should-throw.coffee"

check = require "../.."

errorTests = [
  [ false, 'greaterThan', 0, 'arg must be a number; got false' ]
  [ 0, 'greaterThan', 0, 'arg must be > 0; got 0' ]
  [ -1, 'greaterThan', 0, 'arg must be > 0; got -1' ]
  [ false, 'lessThan', 0, 'arg must be a number; got false' ]
  [ 0, 'lessThan', 0, 'arg must be < 0; got 0' ]
  [ 0, 'lessThan', -1, 'arg must be < -1; got 0' ]
]

errorTests.forEach (params) ->
  [ arg, assertion, param, expectedMessage ] = params

  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".#{assertion}()", ->
      it "should throw new Error('#{expectedMessage}')", ->
        shouldThrow "#{expectedMessage}", -> testedCheck[assertion](param)

nonErrorTests = [
  [ 0, 'greaterThan', -1 ]
  [ 1, 'greaterThan', 0 ]
  [ 0, 'lessThan', 1 ]
  [ -1, 'lessThan', 0 ]
]

nonErrorTests.forEach (params) ->
  [ arg, assertion, param ] = params

  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".#{assertion}()", ->
      it "should not throw", -> testedCheck[assertion](param)

