
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    Undefined : OperatorBuilder<T>;
    undefined : OperatorBuilder<T>;
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

