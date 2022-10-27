
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as oneOf from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    oneOf.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.oneOf([0, \'a\', true])', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be one of [0, \'a\', true] (got';

      assertion(arg => arg.oneOf([0, 'a', true]).throwIfUnmet())
        .withArg(false).throws(`${message0} false)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg('b').throws(`${message0} 'b')`)
        .withArg(true).doesntThrow()
        .withArg('a').doesntThrow()
        .withArg(0).doesntThrow()
      ;
    });
  });
});

