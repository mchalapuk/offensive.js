
import Registry from '../../Registry';
import ConvertsToBooleanAssertion from './ConvertsToBooleanAssertion';

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

export namespace TruthyAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  function register(registry : Registry) {
    registry.addAssertion({
      names: [ 'truthy', 'Truthy', 'truethy', 'Truethy' ],
      assertion: new ConvertsToBooleanAssertion(true),
    });
  }
}

export default TruthyAssertion;

