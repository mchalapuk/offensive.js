
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../anInstanceOf';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class DateAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).is.anInstanceOf(Date).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a date', testedValue);
      },
    };
  }
}

export default DateAssertion;

