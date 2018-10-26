
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Empty : OperatorContext<T>;
    empty : OperatorContext<T>;
  }
}

import check from '..';
import './null';
import './undefined';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.Null.or.Undefined;
  }
}

export default EmptyAssertion;

Registry.instance
  .addAssertion({
    names: [ 'Empty', 'empty' ],
    assertion: new EmptyAssertion(),
  })
;

