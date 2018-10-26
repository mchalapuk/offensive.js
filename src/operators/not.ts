
import Registry from '../Registry';
import { UnaryOperator, Result } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    not : AssertionContext<T>;
    no : AssertionContext<T>;
    doesnt : AssertionContext<T>;
    dont : AssertionContext<T>;
    isnt : AssertionContext<T>;
    arent : AssertionContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class NotOperator implements UnaryOperator {
  apply(operand : Result) {
    return {
      get success() {
        return !operand.success;
      },
      get message() {
        return UnaryOperator.message('not', operand.message);
      },
    };
  }
}

export default NotOperator;

Registry.instance
  .addUnaryOperator({
    names: [ 'not', 'no', 'doesnt', 'dont', 'isnt', 'arent' ],
    operator: new NotOperator(),
  })
;

