
import Registry from '../../Registry';
import MethodAssertion from './MethodAssertion';

import * as fieldThat from '../fieldThat';
import * as aFunction from '../aFunction';

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
  fieldThat.registerIn(registry);
  aFunction.registerIn(registry);

  registry.addAssertionFactory({
    names: [ 'aMethod', 'method' ],

    factory: MethodAssertion.factory,
  });
}

