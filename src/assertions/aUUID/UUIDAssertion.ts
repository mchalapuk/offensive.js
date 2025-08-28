
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../matches';
import '../../connectors';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class UUIDAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).matches(UUID_REGEX).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a UUID', testedValue);
      },
    };
  }
}

export default UUIDAssertion;
