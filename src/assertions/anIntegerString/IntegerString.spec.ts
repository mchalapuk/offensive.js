
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anIntegerString from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anIntegerString.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.anIntegerString()', () => {
    const message0 = 'arg must be an integer string (got';

    assertion(arg => arg.anIntegerString())
      .withArg({}).throws(`${message0} {})`)
      .withArg(false).throws(`${message0} false)`)
      .withArg('a').throws(`${message0} 'a')`)
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(1.1).throws(`${message0} 1.1)`)
      .withArg(42).throws(`${message0} 42)`)
      .withArg('01').throws(`${message0} '01')`)
      .withArg('0.1').throws(`${message0} '0.1')`)
      .withArg(-1000000).throws(`${message0} -1000000)`)
      .withArg('0').doesntThrow()
      .withArg('-0').doesntThrow()
      .withArg('12345678900000').doesntThrow()
      .withArg('-10000000000').doesntThrow()
    ;
  });
});

