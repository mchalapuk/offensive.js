
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aNonEmptyString from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    aNonEmptyString.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.aNonEmptyString()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a non-empty string (got';

      assertion(arg => arg.aNonEmptyString.throwIfUnmet())
        .withArg("a").doesntThrow()
        .withArg(true).throws(`${message0} true)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg([]).throws(`${message0} [])`)
        .withArg("").throws(`${message0} '')`)
      ;
    });
  });
});

