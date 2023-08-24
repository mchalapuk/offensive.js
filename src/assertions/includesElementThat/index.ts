
import Registry from '../../Registry';
import { Result } from '../../model';
import { IncludesElementAssertion } from './IncludesElementAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @assertion .includesElementsThat(assert : InnerExpression);
   *
   * Checks if at least one of elements of an array satisfy an assertion
   * implemented in provided `callback`.
   *
   * ## Example
   *
   * ```
   * // Checks if arg is an array and contains at least one boolean.
   * contract(arg, 'arg')
   *   .includesElementThat(elem => elem.is.aBoolean)
   * ;
   * ```
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    includesElementThat(assert : InnerExpression) : OperatorBuilder<T>;
    includesElement(assert : InnerExpression) : OperatorBuilder<T>;
    containsElementThat(assert : InnerExpression) : OperatorBuilder<T>;
    containsElement(assert : InnerExpression) : OperatorBuilder<T>;
    hasElementThat(assert : InnerExpression) : OperatorBuilder<T>;
    hasElement(assert : InnerExpression) : OperatorBuilder<T>;
    elementThat(assert : InnerExpression) : OperatorBuilder<T>;
    oneElementThat(assert : InnerExpression) : OperatorBuilder<T>;
  }
}

export { IncludesElementAssertion };
export default IncludesElementAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    includesElementThat: IncludesElementAssertion.factory,
    includesElement: IncludesElementAssertion.factory,
    containsElementThat: IncludesElementAssertion.factory,
    containsElement: IncludesElementAssertion.factory,
    hasElementThat: IncludesElementAssertion.factory,
    hasElement: IncludesElementAssertion.factory,
    elementThat: IncludesElementAssertion.factory,
    oneElementThat: IncludesElementAssertion.factory,
  });
}

