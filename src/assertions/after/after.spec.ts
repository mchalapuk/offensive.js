
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as after from '.';

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    after.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.after(new Date(1))', () => {
    const message0 = `arg must be after my birthday (Date('1970-01-01T00:00:00.001Z')) (got`;

    assertion(arg => arg.after(new Date(1), 'my birthday')())
      .withArg(-1000000).throws(`${message0} no date (-1000000))`)
      .withArg(new Date(0)).throws(`${message0} Date('1970-01-01T00:00:00.000Z'))`)
      .withArg(new Date(1)).throws(`${message0} Date('1970-01-01T00:00:00.001Z'))`)
      .withArg(new Date(2)).doesntThrow()
      .withArg(new Date(1000000)).doesntThrow()
    ;
  });
});

