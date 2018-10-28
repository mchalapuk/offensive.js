
import { Assertion, StandardMessage } from '../../model';

import check from '../..';
import '../matches';

const EMAIL_REGEXP = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmailAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
    return {
      get success() {
        return check(testedValue, varName).matches(EMAIL_REGEXP).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an email', testedValue);
      },
    };
  }
}

export default EmailAssertion;

