
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as ofType from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    ofType.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.ofType(\'undefined\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be undefined (got';

      assertion(arg => arg.ofType('undefined').throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg('').throws(`${message0} '')`)
        .withArg(() => {}).throws(`${message0} unnamed function)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg(undefined).doesntThrow()
      ;
    });
  });

  describe('.ofType(\'object\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an object (got';

      assertion(arg => arg.ofType('object').throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).doesntThrow()
        .withArg('').throws(`${message0} '')`)
        .withArg(() => {}).throws(`${message0} unnamed function)`)
        .withArg(null).doesntThrow()
        .withArg(undefined).throws(`${message0} undefined)`)
      ;
    });
  });

  describe('.ofType(\'function\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a function (got';

      assertion(arg => arg.ofType('function').throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg('').throws(`${message0} '')`)
        .withArg(() => {}).doesntThrow()
        .withArg(null).throws(`${message0} null)`)
        .withArg(undefined).throws(`${message0} undefined)`)
      ;
    });
  });

  describe('.ofType(\'string\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a string (got';

      assertion(arg => arg.ofType('string').throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg('').doesntThrow()
        .withArg(() => {}).throws(`${message0} unnamed function)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg(undefined).throws(`${message0} undefined)`)
      ;
    });
  });

  describe('.ofType(\'number\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a number (got';

      assertion(arg => arg.ofType('number').throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(-1).doesntThrow()
        .withArg({}).throws(`${message0} {})`)
        .withArg('').throws(`${message0} '')`)
        .withArg(() => {}).throws(`${message0} unnamed function)`)
        .withArg(null).throws(`${message0} null)`)
        .withArg(undefined).throws(`${message0} undefined)`)
      ;
    });
  });

  describe('.ofType(\'boolean\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be a boolean (got';

      assertion(arg => arg.ofType('boolean').throwIfUnmet())
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
});

