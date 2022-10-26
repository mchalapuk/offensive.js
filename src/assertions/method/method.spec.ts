
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as method from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    method.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.method(\'toString\')', () => {
    const message0 = 'arg.toString must be a function (got';

    assertion(arg => arg.method('toString')())
      .withArg(undefined).throws(`${message0} no object (undefined))`)
      .withArg(null).throws(`${message0} no object (null))`)
      .withArg({ toString() {} }).doesntThrow()
    ;
  });
});

