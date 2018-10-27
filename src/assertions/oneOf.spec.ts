
import './oneOf';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.oneOf([0, \'a\', true])', () => {
    const message0 = 'arg must be one of [0, \'a\', true] (got';

    assertion(arg => arg.is.oneOf([0, 'a', true])())
      .withArg(false).throws(`${message0} false)`)
      .withArg(-1).throws(`${message0} -1)`)
      .withArg('b').throws(`${message0} 'b')`)
      .withArg(true).doesntThrow()
      .withArg('a').doesntThrow()
      .withArg(0).doesntThrow()
    ;
  });

  describe('.is.oneOf([0, \'a\', true])', () => {
    const message0 = 'arg must be a super special number (got';

    assertion(arg => arg.is.oneOf([0, 1, 2], 'be a super special number')())
      .withArg(-1).throws(`${message0} -1)`)
      .withArg(3).throws(`${message0} 3)`)
      .withArg(0).doesntThrow()
      .withArg(1).doesntThrow()
      .withArg(2).doesntThrow()
    ;
  });
});

