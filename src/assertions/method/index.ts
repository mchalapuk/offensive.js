
import Registry from '../../Registry';
import MethodAssertion from './MethodAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aMethod(methodName : string) : OperatorContext<T>;
    method(methodName : string) : OperatorContext<T>;
  }
}

export { MethodAssertion };
export default MethodAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'aMethod', 'method' ],

    factory: MethodAssertion.factory,
  });
}

