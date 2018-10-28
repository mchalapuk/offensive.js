
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.lte(0)', () => {
    const message0 = 'arg must be ≤ 0 (got';

    assertion(arg => arg.is.lte(0)())
      .withArg(1000000).throws(`${message0} 1000000)`)
      .withArg(1).throws(`${message0} 1)`)
      .withArg(true).throws(`${message0} true)`)
      .withArg(0).doesntThrow()
      .withArg(-1).doesntThrow()
      .withArg(false).doesntThrow()
      .withArg(null).doesntThrow()
    ;
  });

  describe('.isnt.gte(0)', () => {
    const message0 = 'arg must not be ≤ 0 (got';

    assertion(arg => arg.isnt.lte(0)())
      .withArg(-1000000).throws(`${message0} -1000000)`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(1).doesntThrow()
    ;
  });
});

