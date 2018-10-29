
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Undefined : OperatorContext<T>;
    undefined : OperatorContext<T>;
  }
}

export const instance = new OfTypeAssertion('undefined');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    Undefined: instance,
    undefined: instance,
  });
}

