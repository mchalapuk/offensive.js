mocha = require 'mocha'
should = require 'should'
shouldThrow = require '../should-throw.coffee'

ContextFactory = require '../../lib/context-factory'
AssertionRegistry = require '../../lib/registry/assertion'
OperatorRegistry = require '../../lib/registry/operator'
NoopRegistry = require '../../lib/registry/noop'
Assertion = require '../../lib/model/assertion'
UnaryOperator = require '../../lib/model/unary-operator'
BinaryOperator = require '../../lib/model/binary-operator'

describeNameValueTest = (testedContext) ->
  it "._name is 'value'", ->
    testedContext()._name.should.be.equal "value"
  it "._value is 'improper'", ->
    testedContext()._value.should.be.equal "improper"

describe "checkFactory.newContext(\"improper\", \"value\")", ->
  noopRegistry = null
  assertionRegistry = null
  operatorRegistry = null
  testedFactory = null
  testedContext = null

  beforeEach ->
    noopRegistry = new NoopRegistry
    assertionRegistry = new AssertionRegistry noopRegistry
    operatorRegistry = new OperatorRegistry noopRegistry, assertionRegistry
    testedFactory = new ContextFactory assertionRegistry, operatorRegistry
    testedFactory.onError = null
    testedContext = testedFactory.newContext "improper", "value"

  describeNameValueTest -> testedContext

  describe ".assertion", ->
    describe "(passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion -> -> true
        testedContext = testedContext.assertion

      describeNameValueTest -> testedContext

      it "() returns 'improper'", ->
        testedContext().should.equal "improper"

      it "._result is true", ->
        testedContext._result.should.be.exactly true

      expectedMessage = "trying to build a message without failed assertions"
      it "._message throws Error('#{expectedMessage}')", ->
        should(-> testedContext._message).throw expectedMessage

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'test', new Assertion ->
          @message.appendText "proper"
          -> false
        testedContext = testedContext.test

      it "() returns 'improper'", ->
        testedContext().should.equal "improper"

      describeNameValueTest -> testedContext

      it "._result is false", ->
        testedContext._result.should.be.exactly false

      expectedMessage = "value must be proper; got 'improper'"
      it "._message is '#{expectedMessage}'", ->
        testedContext._message.should.equal expectedMessage

  describe ".unary.assertion.binary.assertion", ->
    describe "(passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion -> -> true
        operatorRegistry.add 'binary', new BinaryOperator -> -> true
        operatorRegistry.add 'unary', new UnaryOperator -> -> true
        testedContext = testedContext.unary.assertion.binary.assertion

      describeNameValueTest -> testedContext

      it "._result is true", ->
        testedContext._result.should.be.exactly true

      expectedMessage = "trying to build a message without failed assertions"
      it "._message throws Error('#{expectedMessage}')", ->
        should(-> testedContext._message).throw expectedMessage

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion ->
          @message.appendText "proper"
          -> true
        operatorRegistry.add 'binary', new BinaryOperator ->
          @message.appendText "nor"
          -> false
        operatorRegistry.add 'unary', new UnaryOperator ->
          @message.appendText "not"
          -> false
        testedContext = testedContext.unary.assertion.binary.assertion

      describeNameValueTest -> testedContext

      it "._result is false", ->
        testedContext._result.should.be.exactly false

      expectedMessage = "value must be not proper nor proper; got 'improper'"
      it "._message is '#{expectedMessage}'", ->
        testedContext._message.should.equal expectedMessage

  describe ".complex", ->
    beforeEach ->
      assertionRegistry.add 'simple', new Assertion ->
        @message.appendText "proper"
        -> true
      operatorRegistry.add 'and', new BinaryOperator ->
        @message.appendText "and"
        -> false
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
        undefined
      testedContext = testedContext.complex

    describeNameValueTest -> testedContext

    it "._result is false", ->
      testedContext._result.should.be.exactly false

    expectedMessage = "value must be proper; got 'improper'"
    it "._message is '#{expectedMessage}'", ->
      testedContext._message.should.equal expectedMessage

