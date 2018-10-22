
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anArray : OperatorContext<any[]>;
    Array : OperatorContext<any[]>;
    array : OperatorContext<any[]>;
  }
}

import './property';
import './method';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ArrayAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object)
          .has.field('length')
          .and.method('splice')
          .and.method('forEach')
          .success
        ;
      },
      get message() {
        return new StandardMessage(object, 'be an array');
      },
    };
  }
}

export default ArrayAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anArray', 'Array', 'array' ],
    assertion: new ArrayAssertion(),
  })
;

