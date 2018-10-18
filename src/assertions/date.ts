
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aDate : OperatorContext<T & Date>;
    Date : OperatorContext<T & Date>;
    date : OperatorContext<T & Date>;
  }
}

import './instanceOf';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class DateAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return check(value, object).is.anInstanceOf(Date).success;
      },
      get message() {
        return new StandardMessage(object, 'a number');
      },
    };
  }
}

export default DateAssertion;

Registry.instance
  .addAssertion({
    names: [ 'aDate', 'Date', 'date' ],
    assertion: new DateAssertion(),
  })
;

