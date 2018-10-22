
import Registry from '../Registry';
import { Assertion, Result, StandardMessage } from '../model';

import { AssertionContext, OperatorContext } from '../Context';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aString : OperatorContext<string>;
    String : OperatorContext<string>;
    string : OperatorContext<string>;
    str : OperatorContext<string>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StringAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.ofType('string');
  }
}

export default StringAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aString', 'String', 'string', 'str' ],
    assertion: new StringAssertion(),
  })
;

