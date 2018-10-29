
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aDate from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    aDate.registerIn(registry);
  });

  describe('.aDate()', () => {
    const message0 = `arg must be a date (got`;

    assertion(arg => arg.aDate())
      .withArg(Date).throws(`${message0} function Date)`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(new Date()).doesntThrow()
    ;
  });
});

