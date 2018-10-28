
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    True : OperatorContext<T>;
    true : OperatorContext<T>;
  }
}

export namespace TrueAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  function register(registry : Registry) {
    registry.addAssertion({
      names: [ 'True', 'true' ],
      assertion: new ExactlyAssertion(true),
    });
  }
}

export default TrueAssertion;

