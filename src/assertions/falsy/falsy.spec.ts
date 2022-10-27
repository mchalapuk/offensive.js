
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as falsy from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    falsy.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.falsy()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be falsy (got';

      assertion(arg => arg.falsy.throwIfUnmet())
        .withArg({}).throws(`${message0} {})`)
        .withArg([]).throws(`${message0} [])`)
        .withArg([0]).throws(`${message0} [0])`)
        .withArg(null).doesntThrow()
        .withArg(undefined).doesntThrow()
        .withArg('').doesntThrow()
        .withArg('a').throws(`${message0} 'a')`)
        .withArg(0).doesntThrow()
        .withArg(42).throws(`${message0} 42)`)
        .withArg(() => {}).throws(`${message0} unnamed function)`)
        .withArg(false).doesntThrow()
        .withArg(true).throws(`${message0} true)`)
      ;
    });
  });
});

