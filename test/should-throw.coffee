module.exports = (expectedMessage, test)->
  try
    test()

    true.should.be.false "exception not thrown"
  catch e
    throw e unless e.message is expectedMessage

