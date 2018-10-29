
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aString : OperatorBuilder<T>;
    String : OperatorBuilder<T>;
    string : OperatorBuilder<T>;
    str : OperatorBuilder<T>;
  }
}

export const instance = new OfTypeAssertion('string');

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    aString: instance,
    String: instance,
    string: instance,
    str: instance,
  });
}

