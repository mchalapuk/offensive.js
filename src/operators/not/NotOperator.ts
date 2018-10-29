
import { UnaryOperator, Result } from '../../model';

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

