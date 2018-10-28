
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
  assert(testedValue : any, varName : string) {
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

Registry.instance
  .addAssertion({
    names: [ 'anInteger', 'Integer', 'integer', 'anInt', 'Int', 'int' ],
    assertion: new IntegerAssertion(),
  })
;

