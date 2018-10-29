
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as equalTo from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    equalTo.registerIn(registry);
  });

  describe('.equalTo(\'\')', () => {
    const message0 = 'arg must be equal to \'\' (got';

    assertion(arg => arg.equalTo('')())
      .withArg(true).throws(`${message0} true)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg(null).throws(`${message0} null)`)
      .withArg([]).doesntThrow()
      .withArg('').doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(false).doesntThrow()
    ;
  });
});

