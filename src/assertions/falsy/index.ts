
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from '../truthy/ConvertsToBooleanAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    falsy : OperatorContext<T>;
    Falsy : OperatorContext<T>;
    falsey : OperatorContext<T>;
    Falsey : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'falsy', 'Falsy', 'falsey', 'Falsey' ],
    assertion: new ConvertsToBooleanAssertion(false),
  });
}

