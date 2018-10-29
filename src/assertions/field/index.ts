
import Registry from '../../Registry';
import FieldAssertion from './FieldAssertion';

import * as Empty from '../Empty';
import * as Undefined from '../Undefined';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    field(fieldName : string) : OperatorBuilder<T>;
    property(fieldName : string) : OperatorBuilder<T>;
  }
}

export { FieldAssertion };
export default FieldAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  Empty.registerIn(registry);
  Undefined.registerIn(registry);

  registry.addAssertionFactory({
    field: FieldAssertion.factory,
    property: FieldAssertion.factory,
  });
}

