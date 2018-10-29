
import { BinaryOperator, Result } from '../../model';

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

