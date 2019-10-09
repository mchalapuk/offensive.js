
import Registry from '../../Registry';
import IntegerAssertion from './IntegerAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anInteger : OperatorBuilder<T>;
    Integer : OperatorBuilder<T>;
    integer : OperatorBuilder<T>;
    anInt : OperatorBuilder<T>;
    Int : OperatorBuilder<T>;
    int : OperatorBuilder<T>;
  }
}

export { IntegerAssertion };
export default IntegerAssertion;

export const instance = new IntegerAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    anInteger: instance,
    Integer: instance,
    integer: instance,
    anInt: instance,
    Int: instance,
    int: instance,
  });
}

