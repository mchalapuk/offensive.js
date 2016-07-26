should = require "should"
mocha = require "mocha"

LogicalTreeBuilder = require "../../lib/syntax-tree-builder"

describe "SyntaxTreeBuilder", ->
  testedBuilder = null

  beforeEach ->
    testedBuilder = new LogicalTreeBuilder()

  describe ".addOperand", ->
    it "throws when addding two operands without operator", ->
      testedBuilder.addOperand -> "a"
      should(-> testedBuilder.addOperand -> "b")
        .throw "expected binary operator; got operand"

  describe ".addUnaryOperator", ->
    it "throws when addding two unary operators in a row", ->
      testedBuilder.addUnaryOperator -> "b"
      should(-> testedBuilder.addUnaryOperator -> "c")
        .throw "expected operand after unary operator; got unary operator"

  describe ".addBinaryOperator", ->
    it "throws when addding binary operator before operand", ->
      should(-> testedBuilder.addBinaryOperator -> "b")
        .throw "expected operand or unary operator; got binary operator"

    it "throws when addding two binary operators in a row", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.addBinaryOperator -> "c")
        .throw "expected operand or unary operator after binary operator; got binary operator"

  describe ".onEvaluateReady", ->
    it "is called after adding first operand", ->
      result = null
      testedBuilder.onEvaluateReady = (evaluate) -> result = evaluate()
      testedBuilder.addOperand -> true
      result.should.be.true

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
        .throw "trying to evaluate an empty expression"

    it "throws when calling after adding binary operator", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.evaluate())
        .throw "trying to evaluate with dangling binary operator"

    it "throws when calling after adding unary operator", ->
      testedBuilder.addUnaryOperator -> "a"
      should(-> testedBuilder.evaluate())
        .throw "trying to evaluate with dangling unary operator"

    it "returns added operand", ->
      operand = -> true
      testedBuilder.addOperand operand
      testedBuilder.evaluate().should.be.exactly operand

    it "returns unary operator applied to operand", ->
      testedBuilder.addUnaryOperator (operand) -> "a"+ operand()
      testedBuilder.addOperand -> "b"
      testedBuilder.evaluate()().should.be.equal "ab"

    it "returns binary operator applied to operands", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator (lhs, rhs) -> "#{lhs()}#{rhs()}"
      testedBuilder.addOperand -> "b"
      testedBuilder.evaluate()().should.be.equal "ab"

  describe ".flush", ->
    it "throws when calling after adding binary operator", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.addBinaryOperator -> "b"
      should(-> testedBuilder.flush())
        .throw "trying to flush with dangling binary operator"

    it "throws when calling after adding unary operator", ->
      testedBuilder.addUnaryOperator -> "a"
      should(-> testedBuilder.flush())
        .throw "trying to flush with dangling unary operator"

    it "removes operand from the builder", ->
      testedBuilder.addOperand -> "a"
      testedBuilder.flush()
      testedBuilder.operands.length.should.be.equal 0

