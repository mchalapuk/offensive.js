
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.matches(/^\\w+$/gim)', () => {
    const message0 = 'arg must match /^\\w+$/gim (got';

    assertion(arg => arg.matches(/^\w+$/gim)())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg('π').throws(`${message0} 'π')`)
      .withArg('piano').doesntThrow()
    ;
  });
});

