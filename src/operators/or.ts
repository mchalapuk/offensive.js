
import Registry from '../Registry';
import { BinaryOperator, Result } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    or : AssertionContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class OrOperator implements BinaryOperator {
  apply(operands : Result[]) {
    return {
      get success() {
        for (const operand of operands) {
          if (operand.success) {
            // first success means that whole expression is true
            return true;
          }
        }
        return false;
      },
      get message() {
        return BinaryOperator.message('or', operands.map(o => o.message));
      },
    };
  }
}

export default OrOperator;

Registry.instance
  .addBinaryOperator({
    names: [ 'or' ],
    operator: new OrOperator(),
  })
;

