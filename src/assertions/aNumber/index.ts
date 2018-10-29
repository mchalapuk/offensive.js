
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aNumber : OperatorBuilder<T>;
    Number : OperatorBuilder<T>;
    number : OperatorBuilder<T>;
  }
}

export const instance = new OfTypeAssertion('number');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    aNumber: instance,
    Number: instance,
    number: instance,
  });
}

