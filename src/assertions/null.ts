
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Null : OperatorContext<T>;
    null : OperatorContext<T>;
    Nil : OperatorContext<T>;
    nil : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NullAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return value === null;
      },
      get message() {
        return new StandardMessage(object, 'be null', value);
      },
    };
  }
}

export default NullAssertion;

Registry.instance
  .addAssertion({
    names: [ 'Null', 'null', 'Nil', 'nil' ],
    assertion: new NullAssertion(),
  })
;

