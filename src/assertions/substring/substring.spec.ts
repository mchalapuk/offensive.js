
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as substring from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    substring.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.substring()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must have substring \'abc\' (got';

      assertion(arg => arg.substring("abc").throwIfUnmet())
        .withArg("").throws(`${message0} '')`)
        .withArg("a").throws(`${message0} 'a')`)
        .withArg("ab").throws(`${message0} 'ab')`)
        .withArg("abc").doesntThrow()
        .withArg("abcdef").doesntThrow()
        .withArg("xyzabc").doesntThrow()
        .withArg("xyzabcdef").doesntThrow()
      ;
    });
  });
});

