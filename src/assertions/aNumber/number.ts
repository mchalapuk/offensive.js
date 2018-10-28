
import Registry from '../Registry';
import { Assertion } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aNumber : OperatorContext<T>;
    Number : OperatorContext<T>;
    number : OperatorContext<T>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NumberAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.ofType('number');
  }
}

export default NumberAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aNumber', 'Number', 'number' ],
    assertion: new NumberAssertion(),
  })
;

