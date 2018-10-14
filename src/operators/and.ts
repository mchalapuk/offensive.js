
import Registry from '../Registry';
import { BinaryOperator, Result } from '../model';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Registry.instance
  .addOperatorFactory(new BinaryOperator.Factory('and', (lhs, rhs) => lhs.success && rhs.success))
;

