
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as endsWith from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    endsWith.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.endsWith()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must end with \'xyz\' (got';

      assertion(arg => arg.endsWith("xyz").throwIfUnmet())
        .withArg("").throws(`${message0} '')`)
        .withArg("z").throws(`${message0} 'z')`)
        .withArg("yz").throws(`${message0} 'yz')`)
        .withArg("xyz").doesntThrow()
        .withArg("wxyz").doesntThrow()
      ;
    });
  });
});

