
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as includes from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    includes.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.includes(\'test\')', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an array (got';
      const message1 = 'arg must include test (got';

      assertion(arg => arg.includes('test').throwIfUnmet())
        .withArg(null).throws(`${message0} null)`)
        .withArg(true).throws(`${message0} true)`)
        .withArg([]).throws(`${message1} [])`)
        .withArg([1, 2, 3]).throws(`${message1} [1, 2, 3])`)
        .withArg(['foo', 'bar']).throws(`${message1} ['foo', 'bar'])`)
        .withArg(['test']).doesntThrow()
        .withArg(['test', 1, false]).doesntThrow()
        .withArg(['foo', 'test', 'bar']).doesntThrow()
        .withArg(['test', 'test', 'test']).doesntThrow()
      ;
    });
  });
});

