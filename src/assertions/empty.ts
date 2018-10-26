
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Empty : OperatorContext<T>;
    empty : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class EmptyAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return value === null || value === undefined;
      },
      get message() {
        return new StandardMessage(object, 'be empty', value);
      },
    };
  }
}

export default EmptyAssertion;

Registry.instance
  .addAssertion({
    names: [ 'Empty', 'empty' ],
    assertion: new EmptyAssertion(),
  })
;

