
import Registry from '../../Registry';
import { Result } from '../../model';
import { AllFieldsAssertion } from './AllFieldsAssertion';

import * as not from '../../operators/not';
import * as Empty from '../Empty';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @assertion .allFieldsThat(assert : InnerExpression);
   *
   * Checks if values of all fields of an object satisfy an assertion
   * implemented in provided `callback`.
   *
   * Message produced by this assertion contains only the information on fields
   * which did not satisfy the assertion. This is unusual but it makes no sense
   * to list 100 fields in error message when only one did not satisfy the assertion.
   *
   * ## Example
   *
   * ```
   * // Checks if arg is an object and contains only boolean values.
   * contract(arg, 'arg')
   *   .has.allFieldsThat(elem => elem.is.aBoolean)
   * ;
   * ```
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    allFieldsThat(assert : InnerExpression) : OperatorBuilder<T>;
    allFieldsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    onlyFieldsThat(assert : InnerExpression) : OperatorBuilder<T>;
    onlyFieldsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    eachFieldIs(assert : InnerExpression) : OperatorBuilder<T>;
    everyFieldIs(assert : InnerExpression) : OperatorBuilder<T>;
  }
}

export { AllFieldsAssertion };
export default AllFieldsAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  not.registerIn(registry);
  Empty.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    allFieldsThat: AllFieldsAssertion.factory,
    allFieldsWhich: AllFieldsAssertion.factory,
    onlyFieldsThat: AllFieldsAssertion.factory,
    onlyFieldsWhich: AllFieldsAssertion.factory,
    eachFieldIs: AllFieldsAssertion.factory,
    everyFieldIs: AllFieldsAssertion.factory,
  });
}

