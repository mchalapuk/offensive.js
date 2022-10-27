
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../matches';

const EMAIL_REGEXP = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmailAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).matches(EMAIL_REGEXP).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an email', testedValue);
      },
    };
  }
}

export default EmailAssertion;

