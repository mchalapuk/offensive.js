
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as elementThat from '.';

declare module "../../Builder" {
  /**
   * `.good` assertion to be used only in this test.
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
  class FancyAssertion implements Assertion {
    assert(testedValue : any, varName : string) {
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

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    elementThat.registerIn(registry);
    fancy.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.elementThat(1, elem => elem.fancy)', () => {
    const message0 = 'arg[1] must be fancy (got';

    assertion(arg => arg.elementThat(1, elem => elem.fancy)())
      .withArg(null).throws(`${message0} no array operator (null))`)
      .withArg(true).throws(`${message0} no array operator (true))`)
      .withArg({}).throws(`${message0} no array operator ({}))`)
      .withArg([]).throws(`${message0} undefined)`)
      .withArg([0, 1]).throws(`${message0} 1)`)
      .withArg([0, Fancy]).doesntThrow()
    ;
  });
});

