should = require "should"
mocha = require "mocha"
shouldThrow = require "../should-throw.coffee"

check = require "../.."

trueErrorTests = [
  [ null, "null" ]
  [ undefined, "undefined" ]
  [ false, "false" ]
  [ 0, "0" ]
  [ (->), "unnamed function" ]
  [ {}, "{}" ]
  [ [], "[]" ]
  [ "true", "'true'" ]
]

trueErrorTests.forEach (params) ->
  [arg, got] = params

  describe "check(#{got}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".true()", ->
      expectedMessage = "arg must be true; got #{got}"
      it "should throw new Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedCheck.true

falseErrorTests = [
  [ null, "null" ]
  [ undefined, "undefined" ]
  [ true, "true" ]
  [ 0, "0" ]
  [ (->), "unnamed function" ]
  [ {}, "{}" ]
  [ [], "[]" ]
  [ "false", "'false'" ]
]

falseErrorTests.forEach (params) ->
  [arg, got] = params

  describe "check(#{got}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    describe ".true()", ->
      expectedMessage = "arg must be false; got #{got}"
      it "should throw new Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedCheck.false

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
  [
    "truthy",
    [
      [ true, "true" ]
      [ 1, "1" ]
      [ 'a', "'a'" ]
      [ {}, "{}" ]
      [ [], "[]" ]
      [ (->), "unnamed function"]
    ]
  ]
  [
    "falsy",
    [
      [ false, "false" ]
      [ undefined, "undefined" ]
      [ null, "null" ]
      [ 0, "0" ]
      [ "", "''" ]
    ]
  ]
]

tests.forEach (params) ->
  [ assertion, ignored ] = params

  tests.forEach (params) ->
    [ key, args ] = params

    args.forEach (argParams) ->
      [ arg, got ] = argParams

      describe "check(#{got}, 'arg')", ->
        testedCheck = null

        beforeEach ->
          testedCheck = check arg, "arg"

        describe ".#{assertion}()", ->
          if assertion is key
            it "should not throw", -> testedCheck[assertion]
          else
            expectedMessage = "arg must be #{assertion}; got #{got}"
            it "should throw new Error('#{expectedMessage}')", ->
              shouldThrow expectedMessage, -> testedCheck[assertion]

