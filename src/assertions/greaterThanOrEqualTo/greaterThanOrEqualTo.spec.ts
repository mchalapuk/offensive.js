
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as greaterThanOrEqualTo from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    greaterThanOrEqualTo.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.gte(0)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be ≥ 0 (got';

      assertion(arg => arg.gte(0).throwIfUnmet())
        .withArg(-1000000).throws(`${message0} -1000000)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg(0).doesntThrow()
        .withArg(1).doesntThrow()
        .withArg(false).doesntThrow()
        .withArg(true).doesntThrow()
        .withArg(null).doesntThrow()
      ;
    });
  });
});

