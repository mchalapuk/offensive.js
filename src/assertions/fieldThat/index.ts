
import Registry from '../../Registry';
import FieldThatAssertion from './FieldThatAssertion';

import * as Empty from '../Empty';
import * as not from '../../operators/not';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    fieldThat(fieldName : string, assert : InnerExpression) : OperatorBuilder<T>;
    fieldWhich(fieldName : string, assert : InnerExpression) : OperatorBuilder<T>;
    propertyThat(fieldName : string, assert : InnerExpression) : OperatorBuilder<T>;
    propertyWhich(fieldName : string, assert : InnerExpression) : OperatorBuilder<T>;
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

