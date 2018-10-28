
import Registry from '../../Registry';
import { AllElementsAssertion, AllElemsCallback } from './AllElementsAssertion';

import * as anArray from '../anArray';

declare module "../../Context" {

  /**
   * @assertion .allElementsThat<E>(callback : (context : AssertionContext<E>) => Result);
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
  interface AssertionContext<T> {
    allElementsThat<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    allElementsWhich<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    onlyElementsThat<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    onlyElementsWhich<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    eachElementIs<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    everyElementIs<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    allElemsThat<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    allElemsWhich<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    onlyElemsThat<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    onlyElemsWhich<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    eachElemIs<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
    everyElemIs<E>(callback : AllElemsCallback<E>) : OperatorContext<T>;
  }
}

export { AllElementsAssertion };
export default AllElementsAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);

  registry.addAssertionFactory({
    names: [
      'allElementsThat',
      'allElementsWhich',
      'onlyElementsThat',
      'onlyElementsWhich',
      'eachElementIs',
      'everyElementIs',
      'allElemsThat',
      'allElemsWhich',
      'onlyElemsThat',
      'onlyElemsWhich',
      'eachElemIs',
      'everyElemIs',
    ],

    factory : AllElementsAssertion.factory,
  });
}

