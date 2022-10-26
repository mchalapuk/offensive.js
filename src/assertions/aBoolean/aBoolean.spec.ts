
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aBoolean from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    aBoolean.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.aBoolean()', () => {
    const message0 = 'arg must be a boolean (got';

    assertion(arg => arg.aBoolean())
      .withArg({}).throws(`${message0} {})`)
      .withArg([]).throws(`${message0} [])`)
      .withArg([0]).throws(`${message0} [0])`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg('').throws(`${message0} '')`)
      .withArg('a').throws(`${message0} 'a')`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(42).throws(`${message0} 42)`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(false).doesntThrow()
      .withArg(true).doesntThrow()
    ;
  });
});

