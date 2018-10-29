
import Registry from '../../Registry';

import OfTypeAssertion from './OfTypeAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    ofType(requiredType : 'function') : OperatorBuilder<T>;
    ofType(requiredType : 'object') : OperatorBuilder<T>;
    ofType(requiredType : 'string') : OperatorBuilder<T>;
    ofType(requiredType : 'number') : OperatorBuilder<T>;
    ofType(requiredType : 'boolean') : OperatorBuilder<T>;
    ofType(requiredType : 'undefined') : OperatorBuilder<T>;
    type(requiredType : 'function') : OperatorBuilder<T>;
    type(requiredType : 'object') : OperatorBuilder<T>;
    type(requiredType : 'string') : OperatorBuilder<T>;
    type(requiredType : 'number') : OperatorBuilder<T>;
    type(requiredType : 'boolean') : OperatorBuilder<T>;
    type(requiredType : 'undefined') : OperatorBuilder<T>;
  }
}

export { OfTypeAssertion };
export default OfTypeAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    ofType: OfTypeAssertion.factory,
    type: OfTypeAssertion.factory,
  });
}

