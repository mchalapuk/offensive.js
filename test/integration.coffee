should = require 'should'
mocha = require 'mocha'

check = require '../offensive'

originalCheck = check

createTests = (test)-> [
  (arg, expectedMessage)->
    it "should throw Error('#{expectedMessage}')", ->
      try
        test arg
        false.should.be.true 'exception not thrown'
      catch e
        throw e if not (e.message is expectedMessage)
  (arg, got)->
    it "should not throw when called on #{got}", ->
      test arg
]

describe "check", ->
  describe ".is.either.Undefined.or.Null()", ->
    [throwTest, noThrowTest] = createTests (arg) ->
      check(arg, "arg").is.either.Undefined.or.Null

    m = "arg must be undefined or null; got"

    throwTest {}, "#{m} {}"
    throwTest false, "#{m} false"
    throwTest "a", "#{m} 'a'"
    throwTest 42, "#{m} 42"

    noThrowTest undefined, "undefined"
    noThrowTest null, "null"

  describe ".is.anArray.with.length(2)", ->
    [throwTest, noThrowTest] = createTests (arg) ->
      check(arg, "arg").is.anArray.with.length(2)

    m = "arg must be an array; got"

    throwTest null, "#{m} null"
    throwTest undefined, "#{m} undefined"
    throwTest "invalid", "#{m} 'invalid'"
    throwTest {}, "#{m} {}"

    m = "arg.length must be 2; got"

    throwTest [], "#{m} 0"
    throwTest [0, 0 , 0], "#{m} 3"

    noThrowTest [0, 0], "[0, 0]"
    noThrowTest new Array 2, "new Array(2)"

  describe ".has.either.length(2).or.length(4)", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").has.either.length(2).or.length(4)

    m = "arg.length must be 2 or 4; got"

    throwTest [], "#{m} 0"
    throwTest [1], "#{m} 1"
    throwTest [3, 3, 3], "#{m} 3"

    noThrowTest [2, 2], "[2, 2]"
    noThrowTest [4, 4, 4, 4], "[4, 4, 4, 4]"

  describe ".has.length(2).and.length(4)", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").has.length(2).and.length(4)

    throwTest [4, 4, 4, 4], "arg.length must be 2; got 4"
    throwTest [2, 2], "arg.length must be 4; got 2"

  describe ".has.either.length(2).or.either.property('hello')", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").has.either.length(2).or.property('hello')

    m0 = "arg.length must be 2; got"
    m1 = "or arg.hello must be not undefined; got"

    throwTest [], "#{m0} 0 #{m1} undefined"
    throwTest {}, "#{m0} undefined #{m1} undefined"
    throwTest 'a', "#{m0} 1 #{m1} undefined"

    noThrowTest new Array(2), "new Array(2)"
    noThrowTest { hello: 'Neo' }, "{ hello: 'Neo' }"

  describe ".is.either.aNumber.or.either.aString.or.aFunction()", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").is.either.aNumber.or.either.aString.or.aFunction()

    m = "arg must be a number or a string or a function; got"
    throwTest [], "#{m} []"
    throwTest {}, "#{m} {}"

    noThrowTest (->), "(->)"
    noThrowTest 'arrow', "'arrow'"
    noThrowTest 10, "10"

  describe ".has.either.length(2).or.either.property('hi').or.value('there', 'Jane')", ->
    [throwTest, noThrowTest] = createTests (arg)->
      check(arg, "arg").has.either.length(2).or.either.property('hi').or.property('there', 'Jane')

    m0 = "arg.length must be 2; got"
    m1 = "or arg.hi must be not undefined; got"
    m2 = "or arg.there must be 'Jane'; got"

    throwTest [], "#{m0} 0 #{m1} undefined #{m2} undefined"
    throwTest {}, "#{m0} undefined #{m1} undefined #{m2} undefined"
    throwTest 'a', "#{m0} 1 #{m1} undefined #{m2} undefined"

    noThrowTest new Array(2), "new Array(2)"
    noThrowTest { hi: 'Bob' }, "{ hi: 'Bob' }"
    noThrowTest { there: 'Jane' }, "{ there: 'Jane' }"

