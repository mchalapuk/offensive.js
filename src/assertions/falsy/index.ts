
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from '../truthy/ConvertsToBooleanAssertion';

declare module "../Context" {
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

export namespace FalsyAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  function register(registry : Registry) {
    names: [ 'falsy', 'Falsy', 'falsey', 'Falsey' ],
    assertion: new ConvertsToBooleanAssertion(false),
  });
}

export default FalsyAssertion;

