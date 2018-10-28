
import Registry from '../../Registry';
import ExactlyAssertion from '../exactly';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    False : OperatorContext<T>;
    false : OperatorContext<T>;
  }
}

export namespace FalseAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  function register(registry : Registry) {
    registry.addAssertion({
      names: [ 'False', 'false' ],
      assertion: new ExactlyAssertion(false),
    });
  }
}

export default FalseAssertion;

