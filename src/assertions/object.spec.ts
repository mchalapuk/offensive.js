
import './object';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

const instance = {};

describe('check(arg, \'arg\')', () => {
  describe('.is.aRegExp()', () => {
    const message0 = 'arg must be an object; got';

    assertion(arg => arg.is.anObject())
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg(RegExp).throws(`${message0} function RegExp`)
      .withArg(null).doesntThrow()
      .withArg({}).doesntThrow()
      .withArg(new RegExp('a')).doesntThrow()
    ;
  });
});

