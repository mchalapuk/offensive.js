
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anObject : OperatorBuilder<T>;
    Object : OperatorBuilder<T>;
    object : OperatorBuilder<T>;
    obj : OperatorBuilder<T>;
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

