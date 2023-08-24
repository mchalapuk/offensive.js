
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as includesElementThat from '.';
import * as fieldThat from '../fieldThat';

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
  class GoodAssertion<T> implements Assertion<T> {
    assert(varName : string, testedValue : T) {
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

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    includesElementThat.registerIn(registry);
    fieldThat.registerIn(registry);
    good.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.includesElementThat(elem => elem.good)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an array (got';
      const message1 = 'arg[«any»] must be good (got';

      assertion(arg => arg.includesElementThat(elem => elem.good).throwIfUnmet())
        .withArg(null).throws(`${message0} null)`)
        .withArg(true).throws(`${message0} true)`)
        .withArg({}).throws(`${message0} {})`)
        .withArg([]).throws(`${message1} [])`)
        .withArg([Bad, Bad]).throws(`${message1} ['bad', 'bad'])`)
        .withArg([Good, Bad]).doesntThrow()
        .withArg([Good, Good]).doesntThrow()
      ;
    });
  });

  describe('.includesElementThat(elem => elem.hasFieldThat(\'sentiment\', sentiment => sentiment.is.good))', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg must be an array (got';
      const message1 = 'arg[«any»].sentiment must be good (got';

      assertion(arg => arg.includesElementThat(
        elem => elem.has.fieldThat('sentiment', sentiment => sentiment.is.good)
      ).throwIfUnmet())
        .withArg(null).throws(`${message0} null)`)
        .withArg([]).throws(`${message1} [])`)
        .withArg([{sentiment: Bad}, Bad]).throws(`${message1} ['bad', undefined])`)
        .withArg([{sentiment: Good}, {sentiment: Bad}]).doesntThrow()
        .withArg([Good, {sentiment: Good}]).doesntThrow()
      ;
    });
  });
});

