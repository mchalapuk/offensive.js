
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aNumber : OperatorContext<T>;
    Number : OperatorContext<T>;
    number : OperatorContext<T>;
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

