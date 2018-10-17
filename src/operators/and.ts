
import Registry from '../Registry';
import { BinaryOperator, Result } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    and : AssertionContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
Registry.instance
  .addOperatorFactory({
    names: [ 'and' ],
    factory: BinaryOperator.factory('and', (lhs, rhs) => lhs.success && rhs.success),
  })
;

