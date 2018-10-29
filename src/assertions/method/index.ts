
import Registry from '../../Registry';
import MethodAssertion from './MethodAssertion';

import * as fieldThat from '../fieldThat';
import * as aFunction from '../aFunction';
import * as connectors from '../../connectors';

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
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    aMethod: MethodAssertion.factory,
    method: MethodAssertion.factory,
  });
}

