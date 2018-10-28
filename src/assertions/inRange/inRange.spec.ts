
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.inRange(0, 10)', () => {
    const message0 = 'arg must be ≥ 0 (got';
    const message1 = 'arg must be < 10 (got';

    assertion(arg => arg.is.inRange(0, 10)())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg(10).throws(`${message1} 10)`)
      .withArg(false).doesntThrow()
      .withArg(null).doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(9).doesntThrow()
    ;
  });
});

