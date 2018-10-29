
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as allElementsThat from '.';

const Good = {};
const Bad = {};

describe('check(arg, \'arg\')', () => {
  let registry : Registry;

  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }
  beforeEach(() => {
    registry = new Registry();

    allElementsThat.registerIn(registry);
    good.registerIn(registry);
  });

  describe('.allElementsThat(elem => elem.good)', () => {
    const message0 = 'arg[0] must be good (got';
    const message1a = 'arg[1] must be good (got';
    const message1b = 'and arg[1] be good (got';

    assertion(arg => arg.allElementsThat(elem => elem.good)())
      .withArg(null).throws(`${message0} no array operator (null))`)
      .withArg(true).throws(`${message0} no array operator (true))`)
      .withArg({}).throws(`${message0} no array operator ({}))`)
      .withArg([Bad, Bad]).throws(`${message0} 0) ${message1b} 1)`)
      .withArg([Good, Bad]).throws(`${message1a} 1)`)
      .withArg([Good, Good]).doesntThrow()
      .withArg([]).doesntThrow()
    ;
  });
});

declare module "../../Context" {
  /**
   * `.good` assertion to be used only in this test.
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    good : OperatorContext<T>;
  }
}

namespace good {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  class GoodAssertion implements Assertion {
    assert(testedValue : any, varName : string) {
      return {
        get success() {
          return testedValue === Good;
        },
        get message() {
          return new StandardMessage(varName, 'be good', testedValue);
        },
      };
    }
  };

  const instance = new GoodAssertion();

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function registerIn(registry : Registry) {
    registry.addAssertion({ good: instance });
  }
}

