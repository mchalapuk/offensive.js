
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anObject : OperatorContext<T & object>;
    Object : OperatorContext<T & object>;
    object : OperatorContext<T & object>;
    obj : OperatorContext<T & object>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ObjectAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.ofType('object');
  }
}

export default ObjectAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anObject', 'Object', 'object', 'anObject', 'obj' ],
    assertion: new ObjectAssertion(),
  })
;

