
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aRegExp : OperatorContext<T>;
    RegExp : OperatorContext<T>;
    aRegexp : OperatorContext<T>;
    regexp : OperatorContext<T>;
  }
}

import './instanceOf';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class RegExpAssertion implements Assertion {
  assert(value : any, object : string) {
    return check(value, object).is.anInstanceOf(RegExp as any);
  }
}

export default RegExpAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aRegExp', 'RegExp', 'aRegexp', 'regexp' ],
    assertion: new RegExpAssertion(),
  })
;

