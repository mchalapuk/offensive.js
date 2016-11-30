should = require "should"
mocha = require "mocha"
shouldThrow = require "../should-throw.coffee"

check = require "../.."

typeTests = [
  [ "string", "string", "aString", "arg must be a string; got" ]
  [ -1, "-1", "aNumber", "arg must be a number; got" ]
  [ true, "true", "aBoolean", "arg must be a boolean; got" ]
  [ (->), "unnamed function", "aFunction", "arg must be a function; got" ]
  [ {}, "{}", "anObject", "arg must be an object; got" ]
  [ undefined, "undefined", "Undefined", "arg must be undefined; got" ]
]

typeTests.forEach (params) ->
  [ arg, got ] = params

  describe "check(#{arg}, 'arg')", ->
    testedCheck = null

    beforeEach ->
      testedCheck = check arg, "arg"

    typeTests.forEach (params)->
      [ arg2, got2, assertion, expectedMessage ] = params

      describe ".#{assertion}()", ->
        if arg is arg2
          it "should not throw", -> testedCheck[assertion]()
        else
          it "should throw new Error('#{expectedMessage} #{got}')", ->
            shouldThrow "#{expectedMessage} #{got}", -> testedCheck[assertion]()


describe "check([], 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check [], "arg"

  describe ".anArray()", ->
    it "should not throw", -> testedCheck.anArray()

describe "check(new String(), 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check new String(), "arg"

  describe ".anInstanceOf(String)", ->
    it "should not throw", -> testedCheck.anInstanceOf String
  describe ".anInstanceOf(Object)", ->
    it "should not throw", -> testedCheck.anInstanceOf Object

  describe ".anInstanceOf(Number)", ->
    expectedMessage = "arg must be an instance of Number; got {}"
    it "should throw #{expectedMessage}", ->
      shouldThrow expectedMessage, -> testedCheck.anInstanceOf Number

