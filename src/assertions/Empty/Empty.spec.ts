
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as Empty from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    Empty.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.Empty()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be null or undefined (got';

      assertion(arg => arg.Empty.throwIfUnmet())
        .withArg(null).doesntThrow()
        .withArg(undefined).doesntThrow()
        .withArg(true).throws(`${message0} true)`)
        .withArg(false).throws(`${message0} false)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg([]).throws(`${message0} [])`)
      ;
    });
  });
});

