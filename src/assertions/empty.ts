

import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Empty : OperatorContext<null | undefined>;
    empty : OperatorContext<null | undefined>;
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
        return new StandardMessage(object, 'empty');
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

