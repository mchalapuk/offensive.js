
import './integer';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.anInteger()', () => {
    const message0 = 'arg must be an integer; got';

    assertion(arg => arg.is.anInteger())
      .withArg({}).throws(`${message0} {}`)
      .withArg(false).throws(`${message0} false`)
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg(null).throws(`${message0} null`)
      .withArg(null).throws(`${message0} null`)
      .withArg(1.1).throws(`${message0} 1.1`)
      .withArg(42).doesntThrow()
      .withArg(-1000000).doesntThrow()
    ;
  });
});

