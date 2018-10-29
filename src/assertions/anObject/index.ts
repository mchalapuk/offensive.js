
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anObject : OperatorContext<T>;
    Object : OperatorContext<T>;
    object : OperatorContext<T>;
    obj : OperatorContext<T>;
  }
}

export const instance = new OfTypeAssertion('object');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    anObject: instance,
    Object: instance,
    object: instance,
    obj: instance,
  });
}

