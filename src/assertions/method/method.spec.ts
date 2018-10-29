
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as method from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    method.registerIn(registry);
  });

  describe('.method(\'toString\')', () => {
    const message0 = 'arg.toString must be a function (got';

    assertion(arg => arg.method('toString')())
      .withArg(undefined).throws(`${message0} no object (undefined))`)
      .withArg(null).throws(`${message0} no object (null))`)
      .withArg({ toString() {} }).doesntThrow()
    ;
  });
});

