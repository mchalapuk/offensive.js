
import { Assertion, StandardMessage } from '../../model';
import Registry from '../../Registry';
import { TestCaseBuilder, RunFunction } from '../../test/TestCaseBuilder';

import * as allFieldsThat from '.';

declare module "../../Builder" {
  /**
   * `.well` assertion to be used only in this test.
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    well : OperatorBuilder<T>;
  }
}

const Well = 'well';
const Ill = 'ill';

namespace well {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  class WellAssertion implements Assertion {
    assert(varName : string, testedValue : any) {
      return {
        get success() {
          return testedValue === Well;
        },
        get message() {
          return new StandardMessage(varName, 'be well', testedValue);
        },
      };
    }
  };

  const instance = new WellAssertion();

  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function registerIn(registry : Registry) {
    registry.addAssertion({ well: instance });
  }
}

describe('contract(arg, \'arg\')', () => {
  function assertion<ReturnType>(runTestCase : RunFunction<ReturnType>) {
    const registry = new Registry();
    allFieldsThat.registerIn(registry);
    well.registerIn(registry);
    return new TestCaseBuilder<ReturnType>(runTestCase, registry);
  }

  describe('.allFieldsThat(elem => elem.well)', () => {
    describe('.throwIfUnmet()', () => {
      const message0 = 'arg.<all-fields> must be well (got no object (';
      const message1a = 'arg.a must be well (got';
      const message1b = 'and arg.b be well (got';

      assertion(arg => arg.allFieldsThat(value => value.well).throwIfUnmet())
        .withArg(null).throws(`${message0}null))`)
        .withArg(undefined).throws(`${message0}undefined))`)
        .withArg({ a: Ill, b: Well }).throws(`${message1a} 'ill')`)
        .withArg({ a: Ill, b: Ill }).throws(`${message1a} 'ill') ${message1b} 'ill')`)
        .withArg({ a: Well, b: Well }).doesntThrow()
        .withArg({}).doesntThrow()
        .withArg([Well, Well]).doesntThrow()
        .withArg(true).doesntThrow()
      ;
    });
  });
});

