should = require "should"

ExpressionStack = require "../../lib/expression-stack"

describe "ExpressionStack", ->
  testedStack = null

  beforeEach ->
    testedStack = new ExpressionStack()

  it ".stackName is 'bottom'", ->
    testedStack.stackName.should.equal "bottom"

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
