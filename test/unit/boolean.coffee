should = require "should"
mocha = require "mocha"
shouldThrow = require "../should-throw.coffee"

check = require "../.."

trueErrorTests = [ null, undefined, false, 0, (->), {}, [], "string" ]

trueErrorTests.forEach (arg) ->
  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".true()", ->
      expectedMessage = "arg must be true"
      it "should throw new Error('#{expectedMessage}')", ->
        shouldThrow "#{expectedMessage}; got #{arg}", -> testedCheck.true

falseErrorTests = [ null, undefined, true, 0, (->), {}, [], "string" ]

falseErrorTests.forEach (arg) ->
  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".true()", ->
      expectedMessage = "arg must be false"
      it "should throw new Error('#{expectedMessage}')", ->
        shouldThrow "#{expectedMessage}; got #{arg}", -> testedCheck.false

nonErrorTests = [
  [ true, "true" ]
  [ false, "false" ]
]

nonErrorTests.forEach (params) ->
  [ arg, assertion ] = params

  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".#{assertion}()", ->
      it "should not throw", -> testedCheck[assertion]

tests = [
  [ "truthy", [ true, 1, 'a', {}, [], (->) ] ]
  [ "falsy", [ false, undefined, null, 0, '' ] ]
]

tests.forEach (params) ->
  [ assertion, ignored ] = params

  tests.forEach (params) ->
    [ key, args ] = params

    args.forEach (arg) ->
      describe "check(#{arg}, 'arg')", ->
        testedCheck = null

        beforeEach ->
          testedCheck = check arg, "arg"

        describe ".#{assertion}()", ->
          if assertion is key
            it "should not throw", -> testedCheck[assertion]
          else
            expectedMessage = "arg must be #{assertion}"
            it "should throw new Error('#{expectedMessage}')", ->
              shouldThrow "#{expectedMessage}; got #{arg}", -> testedCheck[assertion]

