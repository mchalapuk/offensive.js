
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anInstanceOf from '.';

class TestType {
}

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anInstanceOf.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.instanceOf(TestType)', () => {
    const message0 = 'arg must be an instance of TestType (got';

    assertion(arg => arg.instanceOf(TestType)())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg(TestType).throws(`${message0} function TestType)`)
      .withArg(new TestType()).doesntThrow()
    ;
  });
});

