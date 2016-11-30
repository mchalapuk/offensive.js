mocha = require 'mocha'
should = require 'should'
shouldThrow = require '../should-throw.coffee'

check = require '../../offensive'

describe "check(undefined, \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check undefined, 'arg'

  describe ".is.equal(1)", ->

    expectedMessage = "arg must be equal to 1; got undefined"
    it "should throw new Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedCheck.is.equalTo 1

  describe ".is.equal(undefined)", ->
    it "should not throw", ->
      testedCheck.is.equalTo undefined

  describe ".is.equal(null)", ->
    it "should not throw", ->
      testedCheck.is.equalTo null
