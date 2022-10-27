
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../Null';
import '../Undefined';
import '../../connectors';
import '../../operators/or';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T, contract : ContractFunction) {
    return contract(varName, testedValue).is.Null.or.Undefined;
  }
}

export default EmptyAssertion;

