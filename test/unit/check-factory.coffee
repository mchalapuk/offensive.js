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
  it "._name is 'value'", ->
    testedCheck()._name.should.be.equal "value"
  it "._value is 'improper'", ->
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
        assertionRegistry.add 'assertion', new Assertion -> -> true
        testedCheck = testedCheck.assertion

      describeNameValueTest -> testedCheck

      it "() returns 'improper'", ->
        testedCheck().should.equal "improper"

      it "._result is true", ->
        testedCheck._result.should.be.exactly true

      expectedMessage = "trying to build a message without failed assertions"
      it "._message throws Error('#{expectedMessage}')", ->
        should(-> testedCheck._message).throw expectedMessage

    describe "(not passing)", ->
      beforeEach ->
        assertionRegistry.add 'test', new Assertion ->
          @message.appendText "proper"
          -> false
        testedCheck = testedCheck.test

      it "() returns 'improper'", ->
        testedCheck().should.equal "improper"

      describeNameValueTest -> testedCheck

      it "._result is false", ->
        testedCheck._result.should.be.exactly false

      expectedMessage = "value must be proper; got 'improper'"
      it "._message is '#{expectedMessage}'", ->
        testedCheck._message.should.equal expectedMessage

  describe ".unary.assertion.binary.assertion", ->
    describe "(passing)", ->
      beforeEach ->
        assertionRegistry.add 'assertion', new Assertion -> -> true
        operatorRegistry.add 'binary', new BinaryOperator -> -> true
        operatorRegistry.add 'unary', new UnaryOperator -> -> true
        testedCheck = testedCheck.unary.assertion.binary.assertion

      describeNameValueTest -> testedCheck

      it "._result is true", ->
        testedCheck._result.should.be.exactly true

      expectedMessage = "trying to build a message without failed assertions"
      it "._message throws Error('#{expectedMessage}')", ->
        should(-> testedCheck._message).throw expectedMessage

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
        testedCheck = testedCheck.unary.assertion.binary.assertion

      describeNameValueTest -> testedCheck

      it "._result is false", ->
        testedCheck._result.should.be.exactly false

      expectedMessage = "value must be not proper nor proper; got 'improper'"
      it "._message is '#{expectedMessage}'", ->
        testedCheck._message.should.equal expectedMessage

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
      testedCheck = testedCheck.complex

    describeNameValueTest -> testedCheck

    it "._result is false", ->
      testedCheck._result.should.be.exactly false

    expectedMessage = "value must be proper; got 'improper'"
    it "._message is '#{expectedMessage}'", ->
      testedCheck._message.should.equal expectedMessage

