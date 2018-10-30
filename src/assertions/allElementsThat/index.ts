
import Registry from '../../Registry';
import { Result } from '../../model';
import { AllElementsAssertion } from './AllElementsAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @assertion .allElementsThat(assert : InnerExpression);
   *
   * Checks if all elements of an array satisfy an assertion
   * implemented in provided `callback`.
   *
   * Message produced by this assertion contains only the information on elements
   * which did not satisfy the assertion. This is unusual but it makes no sense
   * to list 100 elements in error message when only one did not satisfy the assertion.
   *
   * ## Example
   *
   * ```
   * // Checks if arg is an array and contains only boolean values.
   * check(arg, 'arg')
   *   .has.allElementsThat(elem => elem.is.aBoolean)
   * ;
   * ```
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    allElementsThat(assert : InnerExpression) : OperatorBuilder<T>;
    allElementsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    onlyElementsThat(assert : InnerExpression) : OperatorBuilder<T>;
    onlyElementsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    eachElementIs(assert : InnerExpression) : OperatorBuilder<T>;
    everyElementIs(assert : InnerExpression) : OperatorBuilder<T>;
    allElemsThat(assert : InnerExpression) : OperatorBuilder<T>;
    allElemsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    onlyElemsThat(assert : InnerExpression) : OperatorBuilder<T>;
    onlyElemsWhich(assert : InnerExpression) : OperatorBuilder<T>;
    eachElemIs(assert : InnerExpression) : OperatorBuilder<T>;
    everyElemIs(assert : InnerExpression) : OperatorBuilder<T>;
  }
}

export { AllElementsAssertion };
export default AllElementsAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    allElementsThat: AllElementsAssertion.factory,
    allElementsWhich: AllElementsAssertion.factory,
    onlyElementsThat: AllElementsAssertion.factory,
    onlyElementsWhich: AllElementsAssertion.factory,
    eachElementIs: AllElementsAssertion.factory,
    everyElementIs: AllElementsAssertion.factory,
    allElemsThat: AllElementsAssertion.factory,
    allElemsWhich: AllElementsAssertion.factory,
    onlyElemsThat: AllElementsAssertion.factory,
    onlyElemsWhich: AllElementsAssertion.factory,
    eachElemIs: AllElementsAssertion.factory,
    everyElemIs: AllElementsAssertion.factory,
  });
}

