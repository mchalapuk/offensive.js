
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aString : OperatorContext<T>;
    String : OperatorContext<T>;
    string : OperatorContext<T>;
    str : OperatorContext<T>;
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

