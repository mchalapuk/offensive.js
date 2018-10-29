
import Registry from '../../Registry';
import { FieldThatAssertion, FieldThatCallback } from './FieldThatAssertion';

import * as Empty from '../Empty';
import * as not from '../../operators/not';
import * as connectors from '../../connectors';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    fieldThat<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    fieldWhich<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    propertyThat<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
    propertyWhich<F>(fieldName : string, callback : FieldThatCallback<F>) : OperatorContext<T>;
  }
}

export { FieldThatAssertion };
export default FieldThatAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  Empty.registerIn(registry);
  not.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    fieldThat: FieldThatAssertion.factory,
    fieldWhich: FieldThatAssertion.factory,
    propertyThat: FieldThatAssertion.factory,
    propertyWhich: FieldThatAssertion.factory,
  });
}

