
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as ofType from '.';

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();
    ofType.registerIn(registry);
  });

  describe('.ofType(\'undefined\')', () => {
    const message0 = 'arg must be undefined (got';

    assertion(arg => arg.ofType('undefined')())
      .withArg(true).throws(`${message0} true)`)
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).doesntThrow()
    ;
  });

  describe('.ofType(\'object\')', () => {
    const message0 = 'arg must be an object (got';

    assertion(arg => arg.ofType('object')())
      .withArg(true).throws(`${message0} true)`)
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).doesntThrow()
      .withArg('').throws(`${message0} '')`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(null).doesntThrow()
      .withArg(undefined).throws(`${message0} undefined)`)
    ;
  });

  describe('.ofType(\'function\')', () => {
    const message0 = 'arg must be a function (got';

    assertion(arg => arg.ofType('function')())
      .withArg(true).throws(`${message0} true)`)
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg(() => {}).doesntThrow()
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
    ;
  });

  describe('.ofType(\'string\')', () => {
    const message0 = 'arg must be a string (got';

    assertion(arg => arg.ofType('string')())
      .withArg(true).throws(`${message0} true)`)
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').doesntThrow()
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
    ;
  });

  describe('.ofType(\'number\')', () => {
    const message0 = 'arg must be a number (got';

    assertion(arg => arg.ofType('number')())
      .withArg(true).throws(`${message0} true)`)
      .withArg(-1).doesntThrow()
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
    ;
  });

  describe('.ofType(\'boolean\')', () => {
    const message0 = 'arg must be a boolean (got';

    assertion(arg => arg.ofType('boolean')())
      .withArg(true).doesntThrow()
      .withArg(-1).throws(`${message0} -1)`)
      .withArg({}).throws(`${message0} {})`)
      .withArg('').throws(`${message0} '')`)
      .withArg(() => {}).throws(`${message0} unnamed function)`)
      .withArg(null).throws(`${message0} null)`)
      .withArg(undefined).throws(`${message0} undefined)`)
    ;
  });
});

