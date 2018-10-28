
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.anEmail()', () => {
    const message0 = 'arg must be an email (got';

    assertion(arg => arg.is.anEmail())
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

