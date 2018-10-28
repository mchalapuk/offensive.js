
import Registry from '../Registry';
import { Assertion } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Undefined : OperatorContext<T>;
    undefined : OperatorContext<T>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UndefinedAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.ofType('undefined');
  }
}

export default UndefinedAssertion;

Registry.instance
  .addAssertion({
    names: [ 'Undefined', 'undefined' ],
    assertion: new UndefinedAssertion(),
  })
;

