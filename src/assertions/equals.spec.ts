
import './equals';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.equalTo(\'\')', () => {
    const message0 = 'arg must be equal to \'\'; got';

    assertion(arg => arg.is.equalTo('')())
      .withArg(true).throws(`${message0} true`)
      .withArg({}).throws(`${message0} {}`)
      .withArg(null).throws(`${message0} null`)
      .withArg([]).doesntThrow()
      .withArg('').doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(false).doesntThrow()
    ;
  });

  describe('.isnt.equalTo(\'\')', () => {
    const message0 = 'arg must not be equal to \'\'; got';

    assertion(arg => arg.isnt.equalTo('')())
      .withArg(true).doesntThrow()
      .withArg({}).doesntThrow()
      .withArg(null).doesntThrow()
      .withArg([]).throws(`${message0} []`)
      .withArg('').throws(`${message0} ''`)
      .withArg(0).throws(`${message0} 0`)
      .withArg(false).throws(`${message0} false`)
    ;
  });
});

