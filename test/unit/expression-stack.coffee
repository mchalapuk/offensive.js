should = require "should"
shouldThrow = require "../should-throw.coffee"

ExpressionStack = require "../../lib/core/expression-stack"

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

    it ".result returns true", ->
      testedStack.result.should.equal true

    describe "after .addBinaryOperator((a, b) => a() && b())", ->
      beforeEach ->
        testedStack.addBinaryOperator (a, b) -> a() && b()

      [true, false].forEach (value) ->
        describe "after .addOperand(() => #{value})", ->
          beforeEach ->
            testedStack.addOperand () -> value

          it ".result returns false", ->
            testedStack.result.should.equal value

  describe "after .push()", ->
    beforeEach ->
      testedStack.push()

    it ".stackName is undefined", ->
      should(testedStack.stackName).equal undefined

    it ".stackId is not 0", ->
      testedStack.stackId.should.not.equal 0

    xdescribe ".result", ->
      expectedMessage = "couldn't fetch .result (not at the bottom of the stack)"
      it "throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.result

    describe "after .addOperand(() => true) and .pop()", ->
      beforeEach ->
        testedStack.addOperand () -> true
        testedStack.pop()

      it ".result returns true", ->
        testedStack.result.should.equal true

      it ".stackName is 'bottom'", ->
        testedStack.stackName.should.equal "bottom"

    describe "after .addOperand(() => false)", ->
      beforeEach ->
        testedStack.addOperand () -> false

      describe "after .pop()", ->
        beforeEach ->
          testedStack.pop()

        it ".result returns false", ->
          testedStack.result.should.equal false

      describe "after .addBinaryOperator((a, b) => a() && b())", ->
        beforeEach ->
          testedStack.addBinaryOperator (a, b) -> a() && b()

        describe "after .addOperand(() => true) and .pop()", ->
          beforeEach ->
            testedStack.addOperand () -> true
            testedStack.pop()

          it ".result returns false", ->
            testedStack.result.should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

        describe "after .forcePop()", ->
          beforeEach ->
            testedStack.forcePop()

          it ".result returns false", ->
            testedStack.result.should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

        describe "after .popWhenReady() and .addOperand(() => true)", ->
          beforeEach ->
            testedStack.popWhenReady()
            testedStack.addOperand () -> true

          it ".result returns false", ->
            testedStack.result.should.equal false

          it ".stackName is 'bottom'", ->
            testedStack.stackName.should.equal "bottom"

    describe "after .forcePop()", ->
      beforeEach ->
        testedStack.forcePop()

      it ".result returns true", ->
        testedStack.result.should.equal true

      it ".stackName is 'bottom'", ->
        testedStack.stackName.should.equal "bottom"

    describe "after .addUnaryOperator((a) => !a())", ->
      beforeEach ->
        testedStack.addUnaryOperator (a, b) -> !a()

      describe "after .addOperand(() => true) and .pop()", ->
        beforeEach ->
          testedStack.addOperand () -> true
          testedStack.pop()

        it ".result returns false", ->
          testedStack.result.should.equal false

        it ".stackName is 'bottom'", ->
          testedStack.stackName.should.equal "bottom"

      describe "after .forcePop()", ->
        beforeEach ->
          testedStack.forcePop()

        it ".result returns false", ->
          testedStack.result.should.equal false

      describe "after .popWhenReady() and .addOperand(() => true)", ->
        beforeEach ->
          testedStack.popWhenReady()
          testedStack.addOperand () -> true

        it ".result returns false", ->
          testedStack.result.should.equal false

        it ".stackName is 'bottom'", ->
          testedStack.stackName.should.equal "bottom"

    describe "after .addOperand(() => true)", ->
      beforeEach ->
        testedStack.addOperand () -> true

      describe ".popWhenReady()", ->
        expectedMessage = ".popWhenReady() called on a stack, which is ready; use .pop() instead"
        it "throws Error('#{expectedMessage}')", ->
          shouldThrow expectedMessage, -> testedStack.popWhenReady()

    describe ".pop('next')", ->
      expectedMessage = "expected call .pop(); got .pop('next'); "+
        "stack level of name 'next' does not exist"
      it "throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.pop "next"

  describe "after .push('next')", ->
    beforeEach ->
      testedStack.push "next"

    it ".stackName is 'next'", ->
      testedStack.stackName.should.equal "next"

    describe ".pop()", ->
      expectedMessage = "expected call .pop('next'); got .pop()"
      it " throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.pop()

    describe ".pop('another')", ->
      expectedMessage = "expected call .pop('next'); got .pop('another'); "+
        "stack level of name 'another' does not exist"
      it " throws Error('#{expectedMessage}')", ->
        shouldThrow expectedMessage, -> testedStack.pop 'another'

    describe "after .push('another')", ->
      beforeEach ->
        testedStack.push "another"

      describe ".pop('next')", ->
        expectedMessage = "expected call .pop('another'); got .pop('next'); "+
          "stack level of name 'next' is 1 level(s) below"
        it " throws Error('#{expectedMessage}')", ->
          shouldThrow expectedMessage, -> testedStack.pop 'next'

    describe "after .addOperand(() => true) and .pop('next')", ->
      beforeEach ->
        testedStack.addOperand -> true
        testedStack.pop "next"

      it ".stackName is 'bottom'", ->
        testedStack.stackName.should.equal "bottom"

    describe "after .popWhenReady('next')", ->
      beforeEach ->
        testedStack.popWhenReady "next"

      it ".stackName is still 'next'", ->
        testedStack.stackName.should.equal "next"

      describe "after .addOperand(() => true)", ->
        beforeEach ->
          testedStack.addOperand () -> true

        it ".stackName is 'bottom'", ->
          testedStack.stackName.should.equal "bottom"

