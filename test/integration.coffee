should = require 'should'
mocha = require 'mocha'

delete require.cache[ require.resolve '../offensive' ]
check = require '../offensive'

describe "check", ->
  describe ".is.Undefined.or.Null()", ->
    test = (arg)-> check(arg, "arg").is.Undefined.or.Null()

    [ {}, false, "the answer is", 42, /but what is the question?/ ].forEach (arg) ->
      expectedMessage = "arg must be undefined or null; got #{arg}"
      it "should throw Error('#{expectedMessage}')", -> should(-> test arg).throw expectedMessage

    [ undefined, null ].forEach (arg) ->
      it "should not throw when called on #{arg}", -> test arg

  describe ".is.anArray.with.length(2)()", ->
    test = (arg)-> check(arg, "arg").is.anArray.with.length(2)()

    [ null, undefined, 'invalid', {} ].forEach (arg) ->
      expectedMessage = "arg must be an array; got #{arg}"
      it "should throw Error('#{expectedMessage}')", -> should(-> test arg).throw expectedMessage

    [ [], [0, 0, 0] ].forEach (arg) ->
      expectedMessage = "arg.length must be 2; got #{arg.length}"
      it "should throw Error('#{expectedMessage}')", -> should(-> test arg).throw expectedMessage

    [ [0, 0], new Array 2 ].forEach (arg) ->
      it "should not throw when called on #{arg}", -> test arg

