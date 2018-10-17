
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';
import { nodsl } from '../utils';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aNumber : OperatorContext<T & number>;
    Number : OperatorContext<T & number>;
    number : OperatorContext<T & number>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NumberAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.ofType('number').success;
      },
      get message() {
        return new StandardMessage(object, 'a number');
      },
    };
  }
}

export default NumberAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aNumber', 'Number', 'number' ],
    assertion: new NumberAssertion(),
  })
;

