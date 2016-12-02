should = require "should"
shouldThrow = require "../should-throw.coffee"

ExpressionStack = require "../../lib/expression-stack"

describe "ExpressionStack", ->
  testedStack = null

  beforeEach ->
    testedStack = new ExpressionStack()

  it ".stackId is 0", ->
    testedStack.stackId.should.equal 0

  it ".stackName is 'bottom'", ->
    testedStack.stackName.should.equal "bottom"

  popMethods = [ 'pop', 'forcePop', 'popWhenReady' ]

  popMethods.forEach (method) ->
    describe ".#{method}()", ->
      expectedMessage = ".#{method}() called at the bottom of the stack"
      it "throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack[method]()

  describe "after .addOperand(() => true)", ->
    beforeEach ->
      testedStack.addOperand () -> true

    it ".evaluate() returns true", ->
      testedStack.evaluate().should.equal true

  describe "after .push()", ->
    beforeEach ->
      testedStack.push()

    it ".stackName is 'unnamed'", ->
      testedStack.stackName.should.equal "unnamed"

    describe ".evaluate()", ->
      expectedMessage = ".evaluate() called not at the bottom of the stack"
      it "throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.evaluate()

    describe "after .addOperand(() => true) and .pop()", ->
      beforeEach ->
        testedStack.addOperand () -> true
        testedStack.pop()

      it ".evaluate() returns true", ->
        testedStack.evaluate().should.equal true

      it ".stackName is 'bottom'", ->
        testedStack.stackName.should.equal "bottom"

    describe "after .addOperand(() => false) and .pop()", ->
      beforeEach ->
        testedStack.addOperand () -> false
        testedStack.pop()

      it ".evaluate() returns false", ->
        testedStack.evaluate().should.equal false

    describe "after .forcePop()", ->
      beforeEach ->
        testedStack.forcePop()

      it ".evaluate() returns true", ->
        testedStack.evaluate().should.equal true

  describe "after .push('next')", ->
    beforeEach ->
      testedStack.push "next"

    it ".stackName is 'next'", ->
      testedStack.stackName.should.equal "next"

