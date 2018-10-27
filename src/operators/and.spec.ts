
import { BinaryOperator, Result, StandardMessage } from '../model';
import AndOperator from './and';

describe('AndOperator', () => {
  let testedOperator : BinaryOperator;

  beforeEach(() => {
    testedOperator = new AndOperator();
  });

  const operandMessages = [
    msg('obj0', 'be 0'),
    msg('obj0', 'be 1'),
    msg('obj1', 'be 2'),
    msg('obj1', 'be 3'),
  ];

  const messageTests = [
    {
      testName: '4 failures, 2 per object',
      operandSuccesses: [false, false, false, false],
      resultMessage: 'obj0 must be 0 and 1 (got {}) and obj1 be 2 and 3 (got {})',
    },
    {
      testName: '2 failures, 1 per object',
      operandSuccesses: [true, false, true, false],
      resultMessage: 'obj0 must be 1 (got {}) and obj1 be 3 (got {})',
    },
    {
      testName: '2 failures, both in same object',
      operandSuccesses: [false, false, true, true],
      resultMessage: 'obj0 must be 0 and 1 (got {})',
    },
  ];

  messageTests.forEach(({ testName, operandSuccesses, resultMessage }) => {
    describe(`.apply(${testName})`, () => {
      it(`returns message \'${resultMessage}\'`, () => {
        const operands = operandMessages.map((message, i) => {
          const success = operandSuccesses[i];
          return { success, message } as Result;
        });

        const result = testedOperator.apply(operands);
        const msgString = result.message.toString();
        msgString.should.equal(resultMessage);
      });
    });
  });

  const successTests = [
    {
      testName: 'two failured results',
      operandSuccesses: [false, false],
      resultSuccess: false,
    },
    {
      testName: 'two succeses results',
      operandSuccesses: [true, true],
      resultSuccess: true,
    },
    {
      testName: 'two failured, one succes',
      operandSuccesses: [false, false, true],
      resultSuccess: false,
    },
  ];

  successTests.forEach(({ testName, operandSuccesses, resultSuccess }) => {
    describe(`.apply(${testName})`, () => {
      it(`results in ${resultSuccess ? 'success' : 'failure'}`, () => {
        const message = msg('', '');
        const operands = operandSuccesses.map(success => ({ success, message } as Result));

        const result = testedOperator.apply(operands);
        result.success.should.equal(resultSuccess);
      });
    });
  });
});

function msg(object : string, requirement : string) {
  return new StandardMessage(object, requirement, {});
}

