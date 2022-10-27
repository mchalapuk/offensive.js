
import { Assertion, ContractFunction, StandardMessage } from '../../model';

import '../Null';
import '../Undefined';
import '../../connectors';
import '../../operators/or';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion implements Assertion {
  assert(varName : string, testedValue : any, contract : ContractFunction) {
    return contract(varName, testedValue).is.Null.or.Undefined;
  }
}

export default EmptyAssertion;

