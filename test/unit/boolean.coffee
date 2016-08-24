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

describe "check(true, 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check true, "arg"

  describe ".true()", ->
    it "should not throw", -> testedCheck.true

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

describe "check(false, 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check false, "arg"

  describe ".false()", ->
    it "should not throw", -> testedCheck.false

