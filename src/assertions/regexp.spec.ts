
import './regexp';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

const instance = {};

describe('check(arg, \'arg\')', () => {
  describe('.is.aRegExp()', () => {
    const message0 = 'arg must be a RegExp (got';

    assertion(arg => arg.is.aRegExp())
      .withArg(undefined).throws(`${message0} undefined)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(RegExp).throws(`${message0} function RegExp)`)
      .withArg(new RegExp('a')).doesntThrow()
      .withArg(/regexp/g).doesntThrow()
    ;
  });
});

