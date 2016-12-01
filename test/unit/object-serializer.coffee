should = require "should"

ObjectSerializer = require "../../lib/object-serializer"

class Bob
  constructor: -> ""


describe "ObjectSerializer", ->
  testedSerializer = null

  beforeEach ->
    testedSerializer = new ObjectSerializer

  tests = [
    [ "a", "'a'" ]
    [ 0, "0" ]
    [ false, "false" ]
    [ (->), "unnamed function" ]
    [ Bob, "function Bob" ]
    [ null, "null" ]
    [ undefined, "undefined" ]
    [ {}, "{}" ]
    [ { a: "a" }, "{ a: 'a' }" ]
    [ { b: 0 }, "{ b: 0 }" ]
    [ { c: true }, "{ c: true }" ]
    [ { d: (->) }, "{ d: unnamed function }" ]
    [ { e: Bob }, "{ e: function Bob }" ]
    [ { f: null }, "{ f: null }" ]
    [ { g: undefined }, "{ g: undefined }" ]
    [ { h: {} }, "{ h: { ... } }" ]
    [ { i: [] }, "{ i: [ ... ] }" ]
    [ [], "[]" ]
    [ [0, 100, 200], "[0, 100, 200]" ]
  ]

  tests.forEach (params) ->
    [arg, expectedResult] = params

    it ".serialize(#{expectedResult}) == #{expectedResult}", ->
      testedSerializer.serializeAny(arg).should.be.equal expectedResult

