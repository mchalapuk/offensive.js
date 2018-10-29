
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anObject from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    anObject.registerIn(registry);
  });

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

