
import './empty';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.Empty()', () => {
    const message0 = 'arg must be null or undefined; got';

    assertion(arg => arg.is.Empty())
      .withArg(null).doesntThrow()
      .withArg(undefined).doesntThrow()
      .withArg(true).throws(`${message0} true`)
      .withArg(false).throws(`${message0} false`)
      .withArg({}).throws(`${message0} {}`)
      .withArg([]).throws(`${message0} []`)
    ;
  });

  describe('.isnt.Empty()', () => {
    const message0 = 'arg must not be null or undefined; got';

    assertion(arg => arg.isnt.Empty())
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg(true).doesntThrow()
      .withArg(false).doesntThrow()
      .withArg({}).doesntThrow()
      .withArg([]).doesntThrow()
    ;
  });
});

