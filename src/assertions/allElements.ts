
import Registry from '../Registry';
import { Assertion, Result, Message, BinaryOperator } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';
import { NoArrayOperator } from '../ObjectSerializer';

declare module "../Context" {
  export type AllElemsCallback<E> = (context : AssertionContext<E>) => Result;

  /**
   * ```
   * .allElementsThat<E>(callback : (context : AssertionContext<E>) => Result);
   * ```
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

import { AllElemsCallback } from '../Context';
import check from '..';
import './array';

let objectNumber = 0;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AllElementsThatAssertion<E> implements Assertion {
  constructor(
    private callback : AllElemsCallback<E>,
  ) {
  }

  assert(value : any, object : string) : Result {
    const { callback } = this;

    // If `value` is not an array, let's just return message about `value[0]` element.
    if (!check(value, object).is.anArray.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoArrayOperator<E>(value);
          const newContext = check(wrapper.cast(), `${object}[0]`);
          return callback(newContext).message;
        },
      }
    }

    // Results produced by applying `callback` to each element.
    let results : Result[] | null = null;

    /**
     * @return lazy-loaded results.
     */
    function getResults() {
      if (results !== null) {
        return results;
      }
      return results = (value as E[])
        .map((elem, i) => callback(check(elem, `${object}[${i}]`)))
      ;
    }

    return {
      get success() {
        for (const result of getResults()) {
          if (!result.success) {
            // First failure means that assertion fails.
            return false;
          }
        }
        return true;
      },
      get message() {
        // Successful results are not contained in the message.
        const errorMessages = getResults()
          .filter(result => !result.success)
          .map(result => result.message)
        ;
        const message = BinaryOperator.message('and', errorMessages);

        return {
          get object() {
            // unique object
            const objects = errorMessages.map(msg => msg.object);
            return `»allElementsThat-[${objects.join(', ')}]-${objectNumber++}`;
          },
          get requirement() {
            return message.requirement;
          },
          get value() {
            return message.value;
          },
          toString() {
            return message.toString();
          },
        };
      },
    };
  }
}

export default AllElementsThatAssertion;

Registry.instance
  .addAssertionFactory({
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

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.allElementsThat requires 1 argument (got ', args.length, ')',
      );
      nodsl.check(
        typeof args[0] === 'function',
        'callback must be a function (got ', (typeof args[0]), ')',
      );

      return new AllElementsThatAssertion(args[0]);
    },
  })
;

