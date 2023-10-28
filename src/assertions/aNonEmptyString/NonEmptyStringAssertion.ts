
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../aString';
import '../length';
import '../../connectors';
import '../../operators/and';
import '../../operators/not';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NonEmptyStringAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).is.aString.and.doesnt.have.length(0).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a non-empty string', testedValue);
      },
    };
  }
}

export default NonEmptyStringAssertion;

