
import Registry from '../Registry';
import { BinaryOperator, Result } from '../model';

Registry.instance.addOperator('and', new BinaryOperator(
  (lhs, rhs) => ({
    get subject() {
      return BinaryOperator.subject(lhs, rhs);
    },
    get success() {
      return lhs.success && rhs.success;
    },
    get message() {
      return BinaryOperator.message(lhs, 'and', rhs);
    },
  }),
));

