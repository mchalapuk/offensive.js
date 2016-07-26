mocha = require 'mocha'
should = require 'should'
shouldThrow = require '../should-throw.coffee'

CheckFactory = require '../../lib/check-factory'
AssertionRegistry = require '../../lib/registry/assertion'
OperatorRegistry = require '../../lib/registry/operator'
NoopRegistry = require '../../lib/registry/noop'
Assertion = require '../../lib/model/assertion'

describe "check object returned from", ->
  noopRegistry = null
  assertionRegistry = null
  operatorRegistry = null
  testedFactory = null

  beforeEach ->
    noopRegistry = new NoopRegistry
    assertionRegistry = new AssertionRegistry noopRegistry
    operatorRegistry = new OperatorRegistry noopRegistry, assertionRegistry
    testedFactory = new CheckFactory assertionRegistry, operatorRegistry
    testedFactory.onError = null

  describe "checkFactory.newCheck(\"name\", \"value\")", ->
    testedCheck = null

    beforeEach ->
      testedCheck = testedFactory.newCheck "name", "value"

    it "has assertion added to registry as its method", ->
      called = false;
      assertionRegistry.add 'test', new Assertion -> called = true
      testedCheck.test
      called.should.be.true

    it "has operator added to registry as its method", ->
      called = false;
      assertionRegistry.add 'test', new Assertion (->)
      assertionRegistry.add 'operator', new Assertion -> called = true
      testedCheck.test.operator
      called.should.be.true

    describe ".test", ->
      it "has call operator that returns \"name\"", ->
        assertionRegistry.add 'test', new Assertion (->)
        testedCheck.test().should.be.equal "name"

      it "._result === true", ->
        assertionRegistry.add 'test', new Assertion (->)
        testedCheck.test._result.should.be.exactly true

      it "._result === false", ->
        assertionRegistry.add 'test', new Assertion(-> @condition = -> false)
        testedCheck.test._result.should.be.exactly false

