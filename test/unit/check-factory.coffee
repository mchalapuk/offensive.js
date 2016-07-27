mocha = require 'mocha'
should = require 'should'
shouldThrow = require '../should-throw.coffee'

CheckFactory = require '../../lib/check-factory'
AssertionRegistry = require '../../lib/registry/assertion'
OperatorRegistry = require '../../lib/registry/operator'
NoopRegistry = require '../../lib/registry/noop'
Assertion = require '../../lib/model/assertion'
UnaryOperator = require '../../lib/model/unary-operator'
BinaryOperator = require '../../lib/model/binary-operator'

describeNameValueTest = (testedCheck) ->
  it "has ._name property containing name of checked value", ->
    testedCheck()._name.should.be.equal "value"
  it "has ._value property containing checked value", ->
    testedCheck()._value.should.be.equal "improper"

describe "checkFactory.newCheck(\"improper\", \"value\")", ->
  noopRegistry = null
  assertionRegistry = null
  operatorRegistry = null
  testedFactory = null
  testedCheck = null

  beforeEach ->
    noopRegistry = new NoopRegistry
    assertionRegistry = new AssertionRegistry noopRegistry
    operatorRegistry = new OperatorRegistry noopRegistry, assertionRegistry
    testedFactory = new CheckFactory assertionRegistry, operatorRegistry
    testedFactory.onError = null
    testedCheck = testedFactory.newCheck "improper", "value"

  describeNameValueTest -> testedCheck

  describe ".assertion", ->
    describe "(passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion ->
          @condition = -> true
        testedCheck = testedCheck.assertion

      describeNameValueTest -> testedCheck

      it "has call operator that returns checked value", ->
        testedCheck().should.equal "improper"

      it "has ._result property equal true", ->
        testedCheck._result.should.be.exactly true

      it "throws when trying to get ._message", ->
        should(-> testedCheck._message)
          .throw "trying to build a message without failed assertions"

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'test', new Assertion ->
          @condition = -> false
          @message = "proper"
        testedCheck = testedCheck.test

      it "has call operator that returns checked value", ->
        testedCheck().should.equal "improper"

      describeNameValueTest -> testedCheck

      it "has ._result property equal false", ->
        testedCheck._result.should.be.exactly false

      it "has ._message contains proper message", ->
        testedCheck._message.should.equal "value must be proper; got improper"

  describe ".unary.assertion.binary.assertion", ->
    describe "(passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion ->
          @condition = -> true
        operatorRegistry.add 'binary', new BinaryOperator ->
          @apply = -> true
        operatorRegistry.add 'unary', new UnaryOperator ->
          @apply = -> true
        testedCheck = testedCheck.unary.assertion.binary.assertion

      describeNameValueTest -> testedCheck

      it "has ._result property equal true", ->
        testedCheck._result.should.be.exactly true

      it "throws when trying to get ._message", ->
        should(-> testedCheck._message)
          .throw "trying to build a message without failed assertions"

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion ->
          @message = "proper"
          @condition = -> true
        operatorRegistry.add 'binary', new BinaryOperator ->
          @message = "nor"
          @apply = -> false
        operatorRegistry.add 'unary', new UnaryOperator ->
          @message = "not"
          @apply = -> false
        testedCheck = testedCheck.unary.assertion.binary.assertion

      describeNameValueTest -> testedCheck

      it "has ._result property equal false", ->
        testedCheck._result.should.be.exactly false

      it "has ._message contains proper message", ->
        testedCheck._message.should.equal "value must be not proper nor proper; got improper"

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion ->
          @message = "proper"
          @condition = -> true
        operatorRegistry.add 'binary', new BinaryOperator ->
          @message = "nor"
          @apply = -> false
        operatorRegistry.add 'unary', new UnaryOperator ->
          @message = "not"
          @apply = -> false
        testedCheck = testedCheck.unary.assertion.binary.assertion

      describeNameValueTest -> testedCheck

      it "has ._result property equal false", ->
        testedCheck._result.should.be.exactly false

      it "has ._message contains proper message", ->
        testedCheck._message.should.equal "value must be not proper nor proper; got improper"

  describe ".complex", ->
    beforeEach ->
      assertionRegistry.add 'simple', new Assertion ->
        @message = "proper"
        @condition = -> true
      operatorRegistry.add 'and', new BinaryOperator ->
        @message = "and"
        @apply = -> false
      assertionRegistry.add 'complex', new Assertion (context) ->
        context._push()
        context._push()
        context.simple
        context._pop()
        context._operatorContext.and
        context._push()
        context.simple
        context._reset()
        context.simple
        context._pop()
        context._pop()
      testedCheck = testedCheck.complex

    describeNameValueTest -> testedCheck

    it "has ._result property equal false", ->
      testedCheck._result.should.be.exactly false

    it "has ._message contains proper message", ->
      testedCheck._message.should.equal "value must be proper and proper; got improper"

