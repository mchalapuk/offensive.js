
import { Assertion, StandardMessage, ContractFunction } from '../../model';

import '../matches';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerStringAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).matches(/^-?(0|([1-9][0-9]*))$/).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an integer string', testedValue);
      },
    };
  }
}

export default IntegerStringAssertion;

