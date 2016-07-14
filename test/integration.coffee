should = require 'should'
mocha = require 'mocha'

delete require.cache[ require.resolve '../offensive' ]
check = require '../offensive'

createTests = (test)-> [
  (arg, expectedMessage)->
    it "should throw Error('#{expectedMessage}')", ->
      try
        test arg
        false.should.be.true 'exception not thrown'
      catch e
        throw e if not (e.message is expectedMessage)
  (arg)->
    it "should not throw when called on #{arg}", ->
      test arg
]

describe "check", ->
  describe ".is.Undefined.or.Null()", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").is.Undefined.or.Null()

    throwTest arg, "arg must be undefined or null; got #{arg}" for arg in  [ {}, false, "a", 42 ]
    noThrowTest arg for arg in [ undefined, null ]

  describe ".is.anArray.with.length(2)()", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").is.anArray.with.length(2)()

    throwTest arg, "arg must be an array; got #{arg}" for arg in [ null, undefined, 'invalid', {} ]
    throwTest arg, "arg.length must be 2; got #{arg.length}" for arg in [ [], [0, 0, 0] ]
    noThrowTest arg for arg in [ [0, 0], new Array 2 ]

  describe ".has.length(2).or.length(4)()", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").has.length(2).or.length(4)()

    throwTest arg, "arg.length must be 2 or 4; got #{arg.length}" for arg in [ [], [1], [3, 3, 3] ]
    noThrowTest arg for arg in [ [2, 2], [4, 4, 4, 4] ]

