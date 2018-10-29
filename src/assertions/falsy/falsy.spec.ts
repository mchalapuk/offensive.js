
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as falsy from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    falsy.registerIn(registry);
  });

  describe('.is.falsy()', () => {
    const message0 = 'arg must be falsy (got';

    assertion(arg => arg.falsy())
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

