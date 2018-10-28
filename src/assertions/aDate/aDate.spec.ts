
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';
import '.';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.aDate()', () => {
    const message0 = `arg must be a date (got`;

    assertion(arg => arg.is.aDate())
      .withArg(Date).throws(`${message0} function Date)`)
      .withArg(0).throws(`${message0} 0)`)
      .withArg(new Date()).doesntThrow()
    ;
  });

  describe('.is.not.aDate()', () => {
    const message0 = `arg must not be a date (got`;

    assertion(arg => arg.is.not.aDate())
      .withArg(Date).doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(new Date()).throws(`${message0} {})`)
    ;
  });
});

