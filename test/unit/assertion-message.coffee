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

    describe "after prending string 'not'", ->
      beforeEach ->
        testedMessage.prependString "not so"

      it "contains strings 'not so' and 'lucky'", ->
        visitor = visitString : sinon.spy()
        testedMessage.applyVisitor visitor
        visitor.visitString.should.be.calledWith "not so"
        visitor.visitString.should.be.calledWith "lucky"

      describe "after appending value 7", ->
        beforeEach ->
          testedMessage.appendValue 7

        it "contains strings 'not so', 'lucky' and value 7", ->
          visitor = visitString : sinon.spy(), visitValue: sinon.spy()
          testedMessage.applyVisitor visitor
          visitor.visitString.should.be.calledWith "not so"
          visitor.visitString.should.be.calledWith "lucky"
          visitor.visitValue.should.be.calledWith 7

