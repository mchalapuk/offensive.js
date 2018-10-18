
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

export const OrOperatorFactory = BinaryOperator.factory(
  'or',
  (lhs, rhs) => lhs.success || rhs.success,
);

export default OrOperatorFactory;

Registry.instance
  .addOperatorFactory({
    names: [ 'or' ],
    factory: OrOperatorFactory,
  })
;

