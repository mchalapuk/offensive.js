
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../anInstanceOf';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class RegExpAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return {
      get success() {
        return contract(varName, testedValue).is.anInstanceOf(RegExp as any).success;
      },
      get message() {
        return new StandardMessage(varName, 'be a RegExp', testedValue);
      },
    };
  }
}

export default RegExpAssertion;

