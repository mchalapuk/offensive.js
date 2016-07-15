mocha = require 'mocha'
should = require 'should'

delete require.cache[ require.resolve '../../offensive' ]
check = require '../../offensive'

shouldThrow = (expectedMessage, test)->
  try
    test()

    true.should.be.false "exception not thrown"
  catch e
    throw e unless e.message is expectedMessage

describe "check(undefined, \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check undefined, 'arg'

  describe ".property(\"name\", \"value\")", ->

    expectedMessage = "arg must be not empty; got undefined"
    it "should throw new Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedCheck.property "name", "value"

describe "check(\"arg\", \"arg\")", ->
  testedCheck = null

  beforeEach ->
    testedCheck = check 'arg', 'arg'

  errorTests = [
    [ null, 'value', 'propertyName must be a string; got null' ]
    [ 'defined', undefined, 'arg.defined must be not undefined; got undefined' ]
    [ 'length', 2, 'arg.length must be 2; got 3' ]
  ]

  errorTests.forEach (params) ->
    [ arg0, arg1, expectedMessage] = params

    describe ".property(#{JSON.stringify(arg0)}, #{JSON.stringify(arg1)})", ->
      it "should throw new Error('#{expectedMessage}')" , ->
        shouldThrow expectedMessage, -> testedCheck.property(arg0, arg1)()

  tests = [
    [ "charAt", undefined ]
    [ "length", 3 ]
  ]

  tests.forEach (params)->
    [ arg0, arg1 ] = params

    describe ".property(\"#{arg0}\", \"#{arg1}\")", ->
      it "should not throw", -> testedCheck.property(arg0, arg1)()

