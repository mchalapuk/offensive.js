
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../aString';
import '../length';
import '../../connectors';
import '../../operators/and';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyStringAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).is.aString.and.have.length(0).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an empty string', testedValue);
      },
    };
  }
}

export default EmptyStringAssertion;

