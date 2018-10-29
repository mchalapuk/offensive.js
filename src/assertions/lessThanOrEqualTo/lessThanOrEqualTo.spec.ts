
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as lessThanOrEqualTo from '.';

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    lessThanOrEqualTo.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.lte(0)', () => {
    const message0 = 'arg must be ≤ 0 (got';

    assertion(arg => arg.lte(0)())
      .withArg(1000000).throws(`${message0} 1000000)`)
      .withArg(1).throws(`${message0} 1)`)
      .withArg(true).throws(`${message0} true)`)
      .withArg(0).doesntThrow()
      .withArg(-1).doesntThrow()
      .withArg(false).doesntThrow()
      .withArg(null).doesntThrow()
    ;
  });
});

