
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInteger : OperatorContext<T>;
    Integer : OperatorContext<T>;
    integer : OperatorContext<T>;
    anInt : OperatorContext<T>;
    Int : OperatorContext<T>;
    int : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IntegerAssertion implements Assertion {
  assert(value : any, object : string) {
    return {
      get success() {
        return Number.isInteger(value);
      },
      get message() {
        return new StandardMessage(object, 'be an integer', value);
      },
    };
  }
}

export default IntegerAssertion;

Registry.instance
  .addAssertion({
    names: [ 'anInteger', 'Integer', 'integer', 'anInt', 'Int', 'int' ],
    assertion: new IntegerAssertion(),
  })
;

