
import Registry from '../../Registry';

import OfTypeAssertion from './OfTypeAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    ofType(requiredType : 'function') : OperatorContext<T>;
    ofType(requiredType : 'object') : OperatorContext<T>;
    ofType(requiredType : 'string') : OperatorContext<T>;
    ofType(requiredType : 'number') : OperatorContext<T>;
    ofType(requiredType : 'boolean') : OperatorContext<T>;
    ofType(requiredType : 'undefined') : OperatorContext<T>;
    type(requiredType : 'function') : OperatorContext<T>;
    type(requiredType : 'object') : OperatorContext<T>;
    type(requiredType : 'string') : OperatorContext<T>;
    type(requiredType : 'number') : OperatorContext<T>;
    type(requiredType : 'boolean') : OperatorContext<T>;
    type(requiredType : 'undefined') : OperatorContext<T>;
  }
}

export { OfTypeAssertion };
export default OfTypeAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function register(registry : Registry) {
  registry.addAssertionFactory({
    ofType: OfTypeAssertion.factory,
    type: OfTypeAssertion.factory,
  });
}

