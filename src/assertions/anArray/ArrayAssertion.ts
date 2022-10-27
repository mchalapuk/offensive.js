
import { Assertion, StandardMessage } from '../../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ArrayAssertion implements Assertion {
  assert(varName : string, testedValue : any) {
    return {
      get success() {
        return Array.isArray(testedValue);
      },
      get message() {
        return new StandardMessage(varName, 'be an array', testedValue);
      },
    };
  }
}

export default ArrayAssertion;
