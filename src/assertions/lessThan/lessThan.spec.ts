
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as lessThan from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    lessThan.registerIn(registry);
  });

  describe('.lt(0)', () => {
    const message0 = 'arg must be < 0 (got';

    assertion(arg => arg.lt(0)())
      .withArg(1000000).throws(`${message0} 1000000)`)
      .withArg(1).throws(`${message0} 1)`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(true).throws(`${message0} true)`)
      .withArg(false).throws(`${message0} false)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(-1).doesntThrow()
    ;
  });
});

