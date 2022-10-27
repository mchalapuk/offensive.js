
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aDate from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    aDate.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.aDate()', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = `arg must be a date (got`;

      assertion(arg => arg.aDate.throwIfUnmet())
        .withArg(Date).throws(`${message0} function Date)`)
        .withArg(0).throws(`${message0} 0)`)
        .withArg(new Date()).doesntThrow()
      ;
    });
  });
});

