
import Registry from '../../Registry';
import FieldAssertion from './FieldAssertion';

import * as Empty from '../Empty';
import * as Undefined from '../Undefined';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    field(fieldName : string) : OperatorContext<T>;
    property(fieldName : string) : OperatorContext<T>;
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
    names: [ 'field', 'property' ],

    factory: FieldAssertion.factory,
  });
}

