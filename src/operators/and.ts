
import Registry from '../Registry';
import { BinaryOperator, Result } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    and : AssertionContext<T>;
    with : AssertionContext<T>;
    of : AssertionContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AndOperator implements BinaryOperator {
  apply(operands : Result[]) {
    return {
      get success() {
        for (const operand of operands) {
          if (!operand.success) {
            // first failure means that whole expression is false
            return false;
          }
        }
        return true;
      },
      get message() {
        return BinaryOperator.message('and', operands.map(o => o.message));
      },
    };
  }
}

export default AndOperator;

Registry.instance
  .addBinaryOperator({
    names: [ 'and', 'with', 'of' ],
    operator: new AndOperator(),
  })
;

