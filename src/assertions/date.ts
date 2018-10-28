
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aDate : OperatorContext<T>;
    Date : OperatorContext<T>;
    date : OperatorContext<T>;
  }
}

import './instanceOf';
import check from '..';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class DateAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return {
      get success() {
        return check(testedValue, varName).is.anInstanceOf(Date).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a date', testedValue);
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

