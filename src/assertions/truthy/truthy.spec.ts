
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.truthy()', () => {
    const message0 = 'arg must be truthy (got';

    assertion(arg => arg.is.truthy())
      .withArg({}).doesntThrow()
      .withArg([]).doesntThrow()
      .withArg([0]).doesntThrow()
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg('').throws(`${message0} '')`)
      .withArg('a').doesntThrow()
      .withArg(0).throws(`${message0} 0)`)
      .withArg(42).doesntThrow()
      .withArg(() => {}).doesntThrow()
      .withArg(false).throws(`${message0} false)`)
      .withArg(true).doesntThrow()
    ;
  });
});

