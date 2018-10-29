
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as exactly from '.';

const instance = {};

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    exactly.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.exactly(instance)', () => {
    const message0 = 'arg must be {} (got';

    assertion(arg => arg.exactly(instance)())
      .withArg(true).throws(`${message0} true)`)
      .withArg(false).throws(`${message0} false)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg([]).throws(`${message0} [])`)
      .withArg(instance).doesntThrow()
    ;
  });
});

