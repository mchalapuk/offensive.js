
import './elementThat';
import './boolean';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.has.elementThat(1, elem => elem.is.aBoolean)', () => {
    const message0 = 'arg[1] must be a boolean (got';

    assertion(arg => arg.has.elementThat(1, elem => elem.is.aBoolean)())
      .withArg(null).throws(`${message0} no array operator (null))`)
      .withArg(true).throws(`${message0} no array operator (true))`)
      .withArg({}).throws(`${message0} no array operator ({}))`)
      .withArg([]).throws(`${message0} undefined)`)
      .withArg([0, 1]).throws(`${message0} 1)`)
      .withArg([0, true]).doesntThrow()
    ;
  });
});

