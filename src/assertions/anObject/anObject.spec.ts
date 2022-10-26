
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anObject from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anObject.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.anObject()', () => {
    const message0 = 'arg must be an object (got';

    assertion(arg => arg.anObject())
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg(RegExp).throws(`${message0} function RegExp)`)
      .withArg(null).doesntThrow()
      .withArg({}).doesntThrow()
      .withArg(new RegExp('a')).doesntThrow()
    ;
  });
});

