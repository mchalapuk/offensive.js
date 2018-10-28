
import { Assertion, StandardMessage } from '../../model';
import check from '../..';

import '../instanceOf';

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

