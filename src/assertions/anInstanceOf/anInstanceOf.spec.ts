
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

class TestType {
}

describe('check(arg, \'arg\')', () => {
  describe('.is.instanceOf(TestType)', () => {
    const message0 = 'arg must be an instance of TestType (got';

    assertion(arg => arg.is.instanceOf(TestType)())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg(TestType).throws(`${message0} function TestType)`)
      .withArg(new TestType()).doesntThrow()
    ;
  });
});

