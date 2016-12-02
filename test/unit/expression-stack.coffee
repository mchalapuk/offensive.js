should = require "should"

ExpressionStack = require "../../lib/expression-stack"

describe "ExpressionStack", ->
  testedStack = null

  beforeEach ->
    testedStack = new ExpressionStack()

  it "contains stack named 'bottom'", ->
    testedStack.stackName.should.equal "bottom"

