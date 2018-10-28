
import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.True()', () => {
    const message0 = 'arg must be true (got';

    assertion(arg => arg.is.True())
      .withArg({}).throws(`${message0} {})`)
      .withArg([]).throws(`${message0} [])`)
      .withArg([0]).throws(`${message0} [0])`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg('').throws(`${message0} '')`)
      .withArg('a').throws(`${message0} 'a')`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(42).throws(`${message0} 42)`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(false).throws(`${message0} false)`)
      .withArg(true).doesntThrow()
    ;
  });
});

