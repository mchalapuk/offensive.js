
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as before from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    before.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.before(new Date(1))', () => {
    const message0 = `arg must be before Date('1970-01-01T00:00:00.001Z') (got`;

    assertion(arg => arg.before(new Date(1))())
      .withArg(-1000000).throws(`${message0} no date (-1000000))`)
      .withArg(new Date(2)).throws(`${message0} Date('1970-01-01T00:00:00.002Z'))`)
      .withArg(new Date(1)).throws(`${message0} Date('1970-01-01T00:00:00.001Z'))`)
      .withArg(new Date(0)).doesntThrow()
      .withArg(new Date(-1)).doesntThrow()
    ;
  });
});

