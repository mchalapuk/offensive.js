
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as inRange from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    inRange.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.inRange(0, 10)', () => {
    const message0 = 'arg must be ≥ 0 (got';
    const message1 = 'arg must be < 10 (got';

    assertion(arg => arg.inRange(0, 10)())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg(10).throws(`${message1} 10)`)
      .withArg(false).doesntThrow()
      .withArg(null).doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(9).doesntThrow()
    ;
  });
});

