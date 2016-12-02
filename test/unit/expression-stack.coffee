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

    describe "after .addBinaryOperator((a, b) => a() && b())", ->
      beforeEach ->
        testedStack.addBinaryOperator (a, b) -> a() && b()

      [true, false].forEach (value) ->
        describe "after .addOperand(() => #{value})", ->
          beforeEach ->
            testedStack.addOperand () -> value

          it ".evaluate() returns false", ->
            testedStack.evaluate().should.equal value

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

    describe "after .addOperand(() => false)", ->
      beforeEach ->
        testedStack.addOperand () -> false

      describe "after .pop()", ->
        beforeEach ->
          testedStack.pop()

        it ".evaluate() returns false", ->
          testedStack.evaluate().should.equal false

      describe "after .addBinaryOperator((a, b) => a() && b())", ->
        beforeEach ->
          testedStack.addBinaryOperator (a, b) -> a() && b()

        describe "after .addOperand(() => true) and .pop()", ->
          beforeEach ->
            testedStack.addOperand () -> true
            testedStack.pop()

          it ".evaluate() returns false", ->
            testedStack.evaluate().should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

        describe "after .forcePop()", ->
          beforeEach ->
            testedStack.forcePop()

          it ".evaluate() returns false", ->
            testedStack.evaluate().should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

        describe "after .popWhenReady() and .addOperand(() => true)", ->
          beforeEach ->
            testedStack.popWhenReady()
            testedStack.addOperand () -> true

          it ".evaluate() returns false", ->
            testedStack.evaluate().should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

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

    describe "after .addOperand(() => true)", ->
      beforeEach ->
        testedStack.addOperand () -> true

      describe ".popWhenReady()", ->
        expectedMessage = ".popWhenReady called on a stack, which is ready; call .pop() instead"
        it "throws Error('#{expectedMessage}')", ->
          shouldThrow expectedMessage, -> testedStack.popWhenReady()

    describe "after .popWhenReady()", ->
      beforeEach ->
        testedStack.popWhenReady()

      it ".stackName is still 'next'", ->
        testedStack.stackName.should.equal "next"

      describe "after .addOperand(() => true)", ->
        beforeEach ->
          testedStack.addOperand () -> true

        it ".stackName is 'bottom'", ->
          testedStack.stackName.should.equal "bottom"

