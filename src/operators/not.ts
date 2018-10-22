
import Registry from '../Registry';
import { UnaryOperator } from '../model';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface OperatorContext<T> {
    not : AssertionContext<T>;
    no : AssertionContext<T>;
    doesnt : AssertionContext<T>;
    dont : AssertionContext<T>;
  }
}

export const AndOperatorFactory = UnaryOperator.factory('not', (operand) => !operand.success);

Registry.instance
  .addOperatorFactory({
    names: [ 'not', 'no', 'doesnt', 'dont' ],
    factory: AndOperatorFactory,
  })
;

