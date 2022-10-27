
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as exactly from '.';

const instance = {};

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    exactly.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.exactly(instance)', () => {
    const message0 = 'arg must be {} (got';

    describe('.throwIfUnmet()', () => {
      assertion(arg => arg.exactly(instance).throwIfUnmet())
        .withArg(true).throws(`${message0} true)`)
        .withArg(false).throws(`${message0} false)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg([]).throws(`${message0} [])`)
        .withArg(instance).doesntThrow()
      ;
    });

    describe('.getError()', () => {
      assertion(arg => arg.exactly(instance).getError())
        .withArg(true).returns(`ContractError: ${message0} true)`)
        .withArg(false).returns(`ContractError: ${message0} false)`)
        .withArg({}).returns(`ContractError: ${message0} {})`)
        .withArg([]).returns(`ContractError: ${message0} [])`)
        .withArg(instance).returns(null)
      ;
    });
  });
});

