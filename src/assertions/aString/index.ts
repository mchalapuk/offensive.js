
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

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'aString', 'String', 'string', 'str' ],
    assertion: new OfTypeAssertion('string'),
  });
}

