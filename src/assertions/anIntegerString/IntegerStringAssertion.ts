
import { Assertion, StandardMessage, CheckFunction } from '../../model';

import '../matches';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerStringAssertion implements Assertion {
  assert(testedValue : any, varName : string, check : CheckFunction) {
    return {
      get success() {
        return check(testedValue, varName).matches(/^-?(0|([1-9][0-9]*))$/).success;
      },
      get message() {
        return new StandardMessage(varName, 'be an integer string', testedValue);
      },
    };
  }
}

export default IntegerStringAssertion;

