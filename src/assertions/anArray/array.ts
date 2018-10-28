
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anArray : OperatorContext<T>;
    Array : OperatorContext<T>;
    array : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class ArrayAssertion implements Assertion {
  assert(testedValue : any, varName : string) {
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

Registry.instance
  .addAssertion({
    names: [ 'anArray', 'Array', 'array' ],
    assertion: new ArrayAssertion(),
  })
;

