should = require "should"
sinon = require "sinon"
mocha = require "mocha"
require "should-sinon"

LogicalTreeBuilder = require "../../lib/syntax-tree-builder"

describe "SyntaxTreeBuilder", ->
  testedBuilder = null

  beforeEach ->
    testedBuilder = new LogicalTreeBuilder()

  describe ".addOperand", ->
    it "throws when addding two operands without operator", ->
      testedBuilder.addOperand -> "a"
      should(-> testedBuilder.addOperand -> "b")
        .throw "BUG! two operands added without binary operator!"

  describe ".addUnaryOperator", ->
    it "throws when addding two unary operators in a row", ->
      testedBuilder.addUnaryOperator -> "b"
      should(-> testedBuilder.addUnaryOperator -> "c")
        .throw "BUG! unary operator added after unary operator!"

  describe ".addBinaryOperator", ->
    it "throws when addding binary operator before operand", ->
      should(-> testedBuilder.addBinaryOperator -> "b")
        .throw "BUG! binary operator added before operand!"

    it "throws when addding two binary operators in a row", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.addBinaryOperator -> "c")
        .throw "BUG! binary operator added after binary operator!"

  describe ".onEvaluateReady", ->
    it "is called after adding first operand", ->
      testedBuilder.onEvaluateReady = sinon.spy()
      operand = -> true
      testedBuilder.addOperand operand
      testedBuilder.onEvaluateReady.should.be.calledWith operand

    it "is called after applying unary operator to operand", ->
      testedBuilder.addUnaryOperator (operand) -> "a"+ operand()
      result = null
      testedBuilder.onEvaluateReady = (evaluate) -> result = evaluate()
      testedBuilder.addOperand -> "b"
      result.should.be.equal "ab"

    it "is called after applying binary operator to operands", ->
      result = null
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator (lhs, rhs) -> "#{lhs()}#{rhs()}"
      testedBuilder.onEvaluateReady = (evaluate) -> result = evaluate()
      testedBuilder.addOperand -> "b"
      result.should.be.equal "ab"

  describe ".evaluate", ->
    it "throws when calling before addding operands", ->
      should(-> testedBuilder.evaluate())
        .throw "BUG! evaluate called without before adding any operand!"

    it "throws when calling after adding binary operator", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.evaluate())
        .throw "BUG! evaluate called with binary operator not applied!"

    it "throws when calling after adding unary operator", ->
      testedBuilder.addUnaryOperator -> "a"
      should(-> testedBuilder.evaluate())
        .throw "BUG! evaluate called with unary operator not applied!"

    it "returns added operand", ->
      operand = -> true
      testedBuilder.addOperand operand
      testedBuilder.evaluate().should.be.true

    it "returns unary operator applied to operand", ->
      testedBuilder.addUnaryOperator (operand) -> "a"+ operand()
      testedBuilder.addOperand -> "b"
      testedBuilder.evaluate().should.be.equal "ab"

    it "returns binary operator applied to operands", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator (lhs, rhs) -> "#{lhs()}#{rhs()}"
      testedBuilder.addOperand -> "b"
      testedBuilder.evaluate().should.be.equal "ab"

  describe ".flush", ->
    it "throws when calling after adding binary operator", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.flush())
        .throw "BUG! flush called with binary operator not applied!"

    it "throws when calling after adding unary operator", ->
      testedBuilder.addUnaryOperator -> "a"
      should(-> testedBuilder.flush())
        .throw "BUG! flush called with unary operator not applied!"

    it "removes operand from the builder", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.flush()
      testedBuilder.operands.length.should.be.equal 0

