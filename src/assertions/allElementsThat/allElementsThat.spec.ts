
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import '.';
import '../aBoolean';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.has.allElementsThat(elem => elem.is.aBoolean)', () => {
    const message0 = 'arg[0] must be a boolean (got';
    const message1a = 'arg[1] must be a boolean (got';
    const message1b = 'and arg[1] be a boolean (got';

    assertion(arg => arg.has.allElementsThat(elem => elem.is.aBoolean)())
      .withArg(null).throws(`${message0} no array operator (null))`)
      .withArg(true).throws(`${message0} no array operator (true))`)
      .withArg({}).throws(`${message0} no array operator ({}))`)
      .withArg([0, 1]).throws(`${message0} 0) ${message1b} 1)`)
      .withArg([true, 1]).throws(`${message1a} 1)`)
      .withArg([false, true]).doesntThrow()
      .withArg([]).doesntThrow()
    ;
  });
});

