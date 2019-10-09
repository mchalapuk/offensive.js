
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anInteger from '.';

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anInteger.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.anInteger()', () => {
    const message0 = 'arg must be an integer (got';

    assertion(arg => arg.anInteger())
      .withArg({}).throws(`${message0} {})`)
      .withArg(false).throws(`${message0} false)`)
      .withArg('a').throws(`${message0} 'a')`)
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(1.1).throws(`${message0} 1.1)`)
      .withArg(42).doesntThrow()
      .withArg(-1000000).doesntThrow()
    ;
  });
});

