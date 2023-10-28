
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anEmptyString from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anEmptyString.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.anEmptyString()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an empty string (got';

      assertion(arg => arg.anEmptyString.throwIfUnmet())
        .withArg("").doesntThrow()
        .withArg(true).throws(`${message0} true)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg([]).throws(`${message0} [])`)
        .withArg("a").throws(`${message0} 'a')`)
      ;
    });
  });
});

