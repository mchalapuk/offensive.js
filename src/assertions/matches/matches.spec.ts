
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as matches from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    matches.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.matches(/^\\w+$/gim)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must match /^\\w+$/gim (got';

      assertion(arg => arg.matches(/^\w+$/gim).throwIfUnmet())
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg('').throws(`${message0} '')`)
        .withArg('π').throws(`${message0} 'π')`)
        .withArg('piano').doesntThrow()
      ;
    });
  });
});

