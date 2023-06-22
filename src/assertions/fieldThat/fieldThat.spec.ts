import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as fieldThat from '.';

declare module "../../Builder" {
  /**
   * `.fancy` assertion to be used only in this test.
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    fancy : OperatorBuilder<T>;
  }
}

const Fancy = {};

namespace fancy {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  class FancyAssertion<T> implements Assertion<T> {
    assert(varName : string, testedValue : T) {
      return {
        get success() {
          return testedValue === Fancy;
        },
        get message() {
          return new StandardMessage(varName, 'be fancy', testedValue);
        },
      };
    }
  };

  const instance = new FancyAssertion();

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function registerIn(registry : Registry) {
    registry.addAssertion({ fancy: instance });
  }
}

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    fieldThat.registerIn(registry);
    fancy.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.fieldThat(\'field\', elem => elem.fancy)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg.field must be fancy (got';

      assertion(arg => arg.fieldThat('field', elem => elem.fancy).throwIfUnmet())
        .withArg(null).throws(`${message0} no object (null))`)
        .withArg(true).throws(`${message0} undefined)`)
        .withArg([]).throws(`${message0} undefined)`)
        .withArg({}).throws(`${message0} undefined)`)
        .withArg({ field: 0 }).throws(`${message0} 0)`)
        .withArg({ field: Fancy }).doesntThrow()
      ;
    });
  });
});

