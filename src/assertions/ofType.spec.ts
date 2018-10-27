
import './ofType';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.ofType(\'undefined\')', () => {
    const message0 = 'arg must be undefined; got';

    assertion(arg => arg.is.ofType('undefined')())
      .withArg(true).throws(`${message0} true`)
      .withArg(-1).throws(`${message0} -1`)
      .withArg({}).throws(`${message0} {}`)
      .withArg('').throws(`${message0} ''`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).doesntThrow()
    ;
  });

  describe('.is.ofType(\'object\')', () => {
    const message0 = 'arg must be an object; got';

    assertion(arg => arg.is.ofType('object')())
      .withArg(true).throws(`${message0} true`)
      .withArg(-1).throws(`${message0} -1`)
      .withArg({}).doesntThrow()
      .withArg('').throws(`${message0} ''`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(null).doesntThrow()
      .withArg(undefined).throws(`${message0} undefined`)
    ;
  });

  describe('.is.ofType(\'function\')', () => {
    const message0 = 'arg must be a function; got';

    assertion(arg => arg.is.ofType('function')())
      .withArg(true).throws(`${message0} true`)
      .withArg(-1).throws(`${message0} -1`)
      .withArg({}).throws(`${message0} {}`)
      .withArg('').throws(`${message0} ''`)
      .withArg(() => {}).doesntThrow()
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
    ;
  });

  describe('.is.ofType(\'string\')', () => {
    const message0 = 'arg must be a string; got';

    assertion(arg => arg.is.ofType('string')())
      .withArg(true).throws(`${message0} true`)
      .withArg(-1).throws(`${message0} -1`)
      .withArg({}).throws(`${message0} {}`)
      .withArg('').doesntThrow()
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
    ;
  });

  describe('.is.ofType(\'number\')', () => {
    const message0 = 'arg must be a number; got';

    assertion(arg => arg.is.ofType('number')())
      .withArg(true).throws(`${message0} true`)
      .withArg(-1).doesntThrow()
      .withArg({}).throws(`${message0} {}`)
      .withArg('').throws(`${message0} ''`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
    ;
  });

  describe('.is.ofType(\'boolean\')', () => {
    const message0 = 'arg must be a boolean; got';

    assertion(arg => arg.is.ofType('boolean')())
      .withArg(true).doesntThrow()
      .withArg(-1).throws(`${message0} -1`)
      .withArg({}).throws(`${message0} {}`)
      .withArg('').throws(`${message0} ''`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
    ;
  });
});

