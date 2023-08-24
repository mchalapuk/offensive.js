
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as includesAllOf from '.';

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    includesAllOf.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.includesAllOf([\'test\', 1, true, undefined, null])', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an array (got';
      const message1 = 'arg must include all of [\'test\', 1, true, undefined, null] (got';

      assertion(arg => arg.includesAllOf(['test', 1, true, undefined, null]).throwIfUnmet())
        .withArg(null).throws(`${message0} null)`)
        .withArg(true).throws(`${message0} true)`)
        .withArg([]).throws(`${message1} [])`)
        .withArg(['test']).throws(`${message1} ['test'])`)
        .withArg(['test', 1]).throws(`${message1} ['test', 1])`)
        .withArg(['test', 1, true, null]).throws(`${message1} ['test', 1, true, null])`)
        .withArg(['test', 1, false, , null]).throws(`${message1} ['test', 1, false, , null])`)
        .withArg(['test', '1', true, , null]).throws(`${message1} ['test', '1', true, , null])`)
        .withArg(['test', 1, 'true', , null]).throws(`${message1} ['test', 1, 'true', , null])`)
        .withArg(['test', 1, true, , null]).doesntThrow()
        .withArg([true, null, 1, , 'test']).doesntThrow()
        .withArg(['test', 'test', 1, 1, true, true, null, null, , ]).doesntThrow()
        .withArg([false, 2, , true, null, 3, 'test', 'foo', 'bar', 1]).doesntThrow()
      ;
    });
  });
});

