
import Registry from '../Registry';
import { Assertion } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aString : OperatorContext<T>;
    String : OperatorContext<T>;
    string : OperatorContext<T>;
    str : OperatorContext<T>;
  }
}

import './ofType';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StringAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return check(testedValue, varName).is.ofType('string');
  }
}

export default StringAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aString', 'String', 'string', 'str' ],
    assertion: new StringAssertion(),
  })
;

