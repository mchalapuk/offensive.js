
import Registry from '../../Registry';
import IntegerAssertion from './IntegerAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInteger : OperatorContext<T>;
    Integer : OperatorContext<T>;
    integer : OperatorContext<T>;
    anInt : OperatorContext<T>;
    Int : OperatorContext<T>;
    int : OperatorContext<T>;
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

