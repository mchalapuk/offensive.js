
import Registry from '../Registry';
import { Assertion } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anObject : OperatorContext<T>;
    Object : OperatorContext<T>;
    object : OperatorContext<T>;
    obj : OperatorContext<T>;
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

