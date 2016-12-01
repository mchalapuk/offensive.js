should = require "should"
sinon = require "sinon"
require "should-sinon"

AssertionMessage = require "../../lib/model/assertion-message"

describe "AssertionMessage", ->
  testedMessage = null

  beforeEach ->
    testedMessage = new AssertionMessage

  describe "after appending string 'lucky'", ->
    beforeEach ->
      testedMessage.appendString "lucky"

    it "contains string 'lucky'", ->
      visitor = visitString : sinon.spy()
      testedMessage.applyVisitor visitor
      visitor.visitString.should.be.calledWith "lucky"

    describe "after appending string 'number'", ->
      beforeEach ->
        testedMessage.appendString "number"

      it "contains strings 'lucky' and 'number'", ->
        visitor = visitString : sinon.spy()
        testedMessage.applyVisitor visitor
        visitor.visitString.should.be.calledWith "lucky"
        visitor.visitString.should.be.calledWith "number"

      describe "after appending value 7", ->
        beforeEach ->
          testedMessage.appendValue 7

        it "contains strings 'lucky', 'number' and value 7", ->
          visitor = visitString : sinon.spy(), visitValue: sinon.spy()
          testedMessage.applyVisitor visitor
          visitor.visitString.should.be.calledWith "lucky"
          visitor.visitString.should.be.calledWith "number"
          visitor.visitValue.should.be.calledWith 7

        it ".applyVisitor returns array of returns from visitors", ->
          returnArg = (arg) -> arg
          visitor = visitString : returnArg, visitValue: returnArg
          testedMessage.applyVisitor(visitor).should.be.eql [ "lucky", "number", 7 ]

