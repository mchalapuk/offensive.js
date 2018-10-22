
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Undefined : OperatorContext<undefined>;
    undefined : OperatorContext<undefined>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UndefinedAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.ofType('undefined');
  }
}

export default UndefinedAssertion;

Registry.instance
  .addAssertion({
    names: [ 'Undefined', 'undefined' ],
    assertion: new UndefinedAssertion(),
  })
;

