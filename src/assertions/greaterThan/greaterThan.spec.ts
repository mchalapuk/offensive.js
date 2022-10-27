
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as greaterThan from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    greaterThan.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.gt(0)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be > 0 (got';

      assertion(arg => arg.gt(0).throwIfUnmet())
        .withArg(-1000000).throws(`${message0} -1000000)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg(0).throws(`${message0} 0)`)
        .withArg(false).throws(`${message0} false)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg(1).doesntThrow()
        .withArg(true).doesntThrow()
      ;
    });
  });
});

