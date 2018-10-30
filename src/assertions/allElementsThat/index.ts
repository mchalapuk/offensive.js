
import Registry from '../../Registry';
import { AllElementsAssertion, AllElemsCallback } from './AllElementsAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {

  /**
   * @assertion .allElementsThat<E>(callback : (context : AssertionBuilder<E>) => Result);
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
    allElementsThat(callback : AllElemsCallback) : OperatorBuilder<T>;
    allElementsWhich(callback : AllElemsCallback) : OperatorBuilder<T>;
    onlyElementsThat(callback : AllElemsCallback) : OperatorBuilder<T>;
    onlyElementsWhich(callback : AllElemsCallback) : OperatorBuilder<T>;
    eachElementIs(callback : AllElemsCallback) : OperatorBuilder<T>;
    everyElementIs(callback : AllElemsCallback) : OperatorBuilder<T>;
    allElemsThat(callback : AllElemsCallback) : OperatorBuilder<T>;
    allElemsWhich(callback : AllElemsCallback) : OperatorBuilder<T>;
    onlyElemsThat(callback : AllElemsCallback) : OperatorBuilder<T>;
    onlyElemsWhich(callback : AllElemsCallback) : OperatorBuilder<T>;
    eachElemIs(callback : AllElemsCallback) : OperatorBuilder<T>;
    everyElemIs(callback : AllElemsCallback) : OperatorBuilder<T>;
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

