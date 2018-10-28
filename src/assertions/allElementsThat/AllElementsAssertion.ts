
import { Assertion, Result, Message, BinaryOperator } from '../../model';
import { AssertionContext } from '../../Context';
import { NoArrayOperator } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';

import check from '../..';
import '../anArray';

export type AllElemsCallback<E> = (context : AssertionContext<E>) => Result;

let objectNumber = 0;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AllElementsAssertion<E> implements Assertion {
  constructor(
    private callback : AllElemsCallback<E>,
  ) {
  }

  assert(testedValue : any, varName : string) : Result {
    const { callback } = this;

    // If `testedValue` is not an array, let's just return message about `testedValue[0]` element.
    if (!check(testedValue, varName).is.anArray.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoArrayOperator<E>(testedValue);
          const newContext = check(wrapper.cast(), `${varName}[0]`);
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
      return results = (testedValue as E[])
        .map((elem, i) => callback(check(elem, `${varName}[${i}]`)))
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
          get varName() {
            // unique var name
            const varNames = errorMessages.map(msg => msg.varName);
            return `»allElementsThat-[${varNames.join(', ')}]-${objectNumber++}`;
          },
          get requirement() {
            return message.requirement;
          },
          get actualValue() {
            return message.actualValue;
          },
          toString() {
            return message.toString();
          },
        };
      },
    };
  }
}

export namespace AllElementsAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.allElementsThat requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'function',
      'callback must be a function (got ', (typeof args[0]), ')',
    );

    return new AllElementsAssertion(args[0]);
  }
}

export default AllElementsAssertion;

