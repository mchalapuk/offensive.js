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

  describe ".pop()", ->
    expectedMessage = ".pop() called at the bottom of the stack"
    it "throws Error('#{expectedMessage}')", ->
      shouldThrow expectedMessage, -> testedStack.pop()

  describe "after .push()", ->
    beforeEach ->
      testedStack.push()

    it ".stackName is 'unnamed'", ->
      testedStack.stackName.should.equal "unnamed"

  describe "after .push('next')", ->
    beforeEach ->
      testedStack.push "next"

    it ".stackName is 'next'", ->
      testedStack.stackName.should.equal "next"

    describe ".evaluate()", ->
      expectedMessage = ".evaluate() called not at the bottom of the stack"
      it "throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.evaluate()

    describe "after .pop()", ->
      beforeEach ->
        testedStack.pop()

      it ".stackName is 'bottom'", ->
        testedStack.stackName.should.equal "bottom"

  describe "after .addOperand(() => true)", ->
    beforeEach ->
      testedStack.addOperand () -> true

    it ".evaluate() returns true", ->
      testedStack.evaluate().should.equal true

