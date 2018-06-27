should = require "should"
mocha = require "mocha"
shouldThrow = require "../should-throw.coffee"

check = require "../.."

describe "check('maciej@github.com', 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check "maciej@github.com", "arg"

  describe ".matches(/.+\\@.+\\..+/)", ->
    it "doesn't throw", ->
      testedCheck.matches /.+\@.+\..+/
  describe ".matches(\'.+\\@.+\\..+\')", ->
    it "doesn't throw", ->
      testedCheck.matches ".+\@.+\..+"

  describe ".matches(\'aaa\')", ->
    it "throws", ->
      should -> testedCheck.matches "aaa"
        .throw "arg must be matching /aaa/; got 'maciej@github.com'"

  describe ".anEmail()", ->
    it "doesn't throw", ->
      testedCheck.anEmail()

describe "check('arg', 'arg')", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check "arg", "arg"

  describe ".anEmail()", ->
    it "throws", ->
      should -> testedCheck.anEmail()
        .throw "arg must be an email; got 'arg'"

