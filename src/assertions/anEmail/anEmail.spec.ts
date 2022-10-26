
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anEmail from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anEmail.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.anEmail()', () => {
    const message0 = 'arg must be an email (got';

    assertion(arg => arg.anEmail())
      .withArg(null).throws(`${message0} null)`)
      .withArg(true).throws(`${message0} true)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg('a@b.c').throws(`${message0} 'a@b.c')`)
      .withArg('spam@quedex.net').doesntThrow()
      .withArg('satoshi@quedex.exchange').doesntThrow()
    ;
  });
});

