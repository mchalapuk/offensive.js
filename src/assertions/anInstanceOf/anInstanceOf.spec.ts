
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as anInstanceOf from '.';

class NoArgConstructor {
}
class MultiArgConstructor {
  constructor(arg0 : string, arg1 : number, arg2 : boolean) {
  }
}

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    anInstanceOf.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.instanceOf(NoArgConstructor)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an instance of NoArgConstructor (got';

      assertion(arg => arg.instanceOf(NoArgConstructor).throwIfUnmet())
        .withArg(-1).throws(`${message0} -1)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg(NoArgConstructor).throws(`${message0} function NoArgConstructor)`)
        .withArg(new NoArgConstructor()).doesntThrow()
      ;
    });
  });

  describe('.instanceOf(MultiArgConstructor)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an instance of MultiArgConstructor (got';

      assertion(arg => arg.instanceOf(MultiArgConstructor).throwIfUnmet())
        .withArg(new MultiArgConstructor('', 0, false)).doesntThrow()
      ;
    });
  });
});

