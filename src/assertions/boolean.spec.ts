
import './boolean';
import check from '..';

import { TestCaseBuilder, RunFunction } from '../test/TestCaseBuilder';

function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
  return new TestCaseBuilder<ReturnType>(runTestCase);
}

describe('check(arg, \'arg\')', () => {
  describe('.is.aBoolean()', () => {
    const message0 = 'arg must be a boolean; got';

    assertion(arg => arg.is.aBoolean())
      .withArg({}).throws(`${message0} {}`)
      .withArg([]).throws(`${message0} []`)
      .withArg([0]).throws(`${message0} [0]`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg('').throws(`${message0} ''`)
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(0).throws(`${message0} 0`)
      .withArg(42).throws(`${message0} 42`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(false).doesntThrow()
      .withArg(true).doesntThrow()
    ;
  });

  describe('.isnt.aBoolean()', () => {
    const message0 = 'arg must not be a boolean; got';

    assertion(arg => arg.isnt.aBoolean())
      .withArg({}).doesntThrow()
      .withArg([]).doesntThrow()
      .withArg([0]).doesntThrow()
      .withArg(null).doesntThrow()
      .withArg(undefined).doesntThrow()
      .withArg('').doesntThrow()
      .withArg('a').doesntThrow()
      .withArg(0).doesntThrow()
      .withArg(42).doesntThrow()
      .withArg(() => {}).doesntThrow()
      .withArg(false).throws(`${message0} false`)
      .withArg(true).throws(`${message0} true`)
    ;
  });

  describe('.is.True()', () => {
    const message0 = 'arg must be true; got';

    assertion(arg => arg.is.True())
      .withArg({}).throws(`${message0} {}`)
      .withArg([]).throws(`${message0} []`)
      .withArg([0]).throws(`${message0} [0]`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg('').throws(`${message0} ''`)
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(0).throws(`${message0} 0`)
      .withArg(42).throws(`${message0} 42`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(false).throws(`${message0} false`)
      .withArg(true).doesntThrow()
    ;
  });

  describe('.is.False()', () => {
    const message0 = 'arg must be false; got';

    assertion(arg => arg.is.False())
      .withArg({}).throws(`${message0} {}`)
      .withArg([]).throws(`${message0} []`)
      .withArg([0]).throws(`${message0} [0]`)
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg('').throws(`${message0} ''`)
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(0).throws(`${message0} 0`)
      .withArg(42).throws(`${message0} 42`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(false).doesntThrow()
      .withArg(true).throws(`${message0} true`)
    ;
  });

  describe('.is.truthy()', () => {
    const message0 = 'arg must be truthy; got';

    assertion(arg => arg.is.truthy())
      .withArg({}).doesntThrow()
      .withArg([]).doesntThrow()
      .withArg([0]).doesntThrow()
      .withArg(null).throws(`${message0} null`)
      .withArg(undefined).throws(`${message0} undefined`)
      .withArg('').throws(`${message0} ''`)
      .withArg('a').doesntThrow()
      .withArg(0).throws(`${message0} 0`)
      .withArg(42).doesntThrow()
      .withArg(() => {}).doesntThrow()
      .withArg(false).throws(`${message0} false`)
      .withArg(true).doesntThrow()
    ;
  });

  describe('.is.falsy()', () => {
    const message0 = 'arg must be falsy; got';

    assertion(arg => arg.is.falsy())
      .withArg({}).throws(`${message0} {}`)
      .withArg([]).throws(`${message0} []`)
      .withArg([0]).throws(`${message0} [0]`)
      .withArg(null).doesntThrow()
      .withArg(undefined).doesntThrow()
      .withArg('').doesntThrow()
      .withArg('a').throws(`${message0} 'a'`)
      .withArg(0).doesntThrow()
      .withArg(42).throws(`${message0} 42`)
      .withArg(() => {}).throws(`${message0} unnamed function`)
      .withArg(false).doesntThrow()
      .withArg(true).throws(`${message0} true`)
    ;
  });
});

