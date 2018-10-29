
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as aRegExp from '.';

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    aRegExp.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.aRegExp()', () => {
    const message0 = 'arg must be a RegExp (got';

    assertion(arg => arg.aRegExp())
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(RegExp).throws(`${message0} function RegExp)`)
      .withArg(new RegExp('a')).doesntThrow()
      .withArg(/regexp/g).doesntThrow()
    ;
  });
});

