
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aUUID from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    aUUID.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.aUUID()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a UUID (got';

      assertion(arg => arg.aUUID.throwIfUnmet())
        .withArg("123e4567-e89b-12d3-a456-426614174000").doesntThrow()
        .withArg(true).throws(`${message0} true)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg([]).throws(`${message0} [])`)
        .withArg("").throws(`${message0} '')`)
      ;
    });
  });
});
