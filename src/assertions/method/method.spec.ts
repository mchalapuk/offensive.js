
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.has.method(\'toString\')', () => {
    const message0 = 'arg.toString must be a function (got';

    assertion(arg => arg.has.method('toString')())
      .withArg(undefined).throws(`${message0} no object (undefined))`)
      .withArg(null).throws(`${message0} no object (null))`)
      .withArg({ toString() {} }).doesntThrow()
    ;
  });
});

