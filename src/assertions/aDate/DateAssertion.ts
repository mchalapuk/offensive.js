
import { Assertion, CheckFunction, StandardMessage } from '../../model';

import '../anInstanceOf';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class DateAssertion implements Assertion {
  assert(testedValue : any, varName : string, check : CheckFunction) {
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

