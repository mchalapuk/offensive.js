
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
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.ofType('object');
  }
}

export default ObjectAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anObject', 'Object', 'object', 'obj' ],
    assertion: new ObjectAssertion(),
  })
;

