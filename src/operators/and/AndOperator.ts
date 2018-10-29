
import { BinaryOperator, Result } from '../../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AndOperator implements BinaryOperator {
  apply(operands : Result[]) {
    return {
      get success() {
        for (const operand of operands) {
          if (!operand.success) {
            // First failure means that whole expression is false.
            return false;
          }
        }
        return true;
      },
      get message() {
        // We want to report only on failures.
        const failures = operands.filter(result => !result.success);
        return BinaryOperator.message('and', failures.map(o => o.message));
      },
    };
  }
}

export default AndOperator;

