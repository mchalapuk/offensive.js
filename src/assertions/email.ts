
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anEmail : OperatorContext<string>;
    Email : OperatorContext<string>;
    email : OperatorContext<string>;
  }
}

import './matches';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NumberAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).matches(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i).success;
      },
      get message() {
        return new StandardMessage(object, 'an email');
      },
    };
  }
}

export default NumberAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anEmail', 'Email', 'email' ],
    assertion: new NumberAssertion(),
  })
;

