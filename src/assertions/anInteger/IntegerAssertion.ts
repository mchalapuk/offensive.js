
import { Assertion, StandardMessage } from '../../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerAssertion implements Assertion {
  assert(varName : string, testedValue : any) {
    return {
      get success() {
        return Number.isInteger(testedValue);
      },
      get message() {
        return new StandardMessage(varName, 'be an integer', testedValue);
      },
    };
  }
}

export default IntegerAssertion;

