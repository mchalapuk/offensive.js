
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

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
    return {
      get success() {
        return check(value, object).is.ofType('object').success;
      },
      get message() {
        return new StandardMessage(object, 'an object');
      },
    };
  }
}

export default ObjectAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anObject', 'Object', 'object', 'anObject', 'obj' ],
    assertion: new ObjectAssertion(),
  })
;

