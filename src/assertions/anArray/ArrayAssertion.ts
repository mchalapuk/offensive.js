
import { Assertion, StandardMessage } from '../../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ArrayAssertion<T> implements Assertion<T> {
  assert(varName : string, testedValue : T) {
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
