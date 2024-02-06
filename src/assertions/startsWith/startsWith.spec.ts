
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as startsWith from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    startsWith.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.startsWith()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must start with \'abc\' (got';

      assertion(arg => arg.startsWith("abc").throwIfUnmet())
        .withArg("").throws(`${message0} '')`)
        .withArg("a").throws(`${message0} 'a')`)
        .withArg("ab").throws(`${message0} 'ab')`)
        .withArg("abc").doesntThrow()
        .withArg("abcdefg").doesntThrow()
      ;
    });
  });
});

