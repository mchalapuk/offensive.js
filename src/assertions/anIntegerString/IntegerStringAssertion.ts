
import { Assertion, StandardMessage, ContractFunction } from '../../model';

import '../matches';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerStringAssertion implements Assertion {
  assert(testedValue : any, varName : string, contract : ContractFunction) {
    return {
      get success() {
        return contract(testedValue, varName).matches(/^-?(0|([1-9][0-9]*))$/).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an integer string', testedValue);
      },
    };
  }
}

export default IntegerStringAssertion;

