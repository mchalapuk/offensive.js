
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as allElementsThat from '.';

declare module "../../Builder" {
  /**
   * `.good` assertion to be used only in this test.
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    good : OperatorBuilder<T>;
  }
}

const Good = 'good';
const Bad = 'bad';

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

describe('check(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    allElementsThat.registerIn(registry);
    good.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.allElementsThat(elem => elem.good)', () => {
    const message0 = 'arg[0] must be good (got';
    const message1a = 'arg[1] must be good (got';
    const message1b = 'and arg[1] be good (got';

    assertion(arg => arg.allElementsThat(elem => elem.good)())
      .withArg(null).throws(`${message0} no array operator (null))`)
      .withArg(true).throws(`${message0} no array operator (true))`)
      .withArg({}).throws(`${message0} no array operator ({}))`)
      .withArg([Bad, Bad]).throws(`${message0} 'bad') ${message1b} 'bad')`)
      .withArg([Good, Bad]).throws(`${message1a} 'bad')`)
      .withArg([Good, Good]).doesntThrow()
      .withArg([]).doesntThrow()
    ;
  });
});

