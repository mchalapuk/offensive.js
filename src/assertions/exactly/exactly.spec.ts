
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

const instance = {};

describe('check(arg, \'arg\')', () => {
  describe('.is.exacly(instance)', () => {
    const message0 = 'arg must be {} (got';

    assertion(arg => arg.is.exactly(instance)())
      .withArg(true).throws(`${message0} true)`)
      .withArg(false).throws(`${message0} false)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg([]).throws(`${message0} [])`)
      .withArg(instance).doesntThrow()
    ;
  });

  describe('.isnt.exactly(instance)', () => {
    const message0 = 'arg must not be {} (got';

    assertion(arg => arg.isnt.exactly(instance)())
      .withArg(true).doesntThrow()
      .withArg(false).doesntThrow()
      .withArg({}).doesntThrow()
      .withArg([]).doesntThrow()
      .withArg(instance).throws(`${message0} {})`)
    ;
  });
});

