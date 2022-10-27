
import { Assertion, ContractFunction, Result, Message, BinaryOperator } from '../../model';
import { NoArrayOperator } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';
import { InnerExpression } from '../../Builder';

import '../anArray';
import '../../connectors';

let objectNumber = 0;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AllElementsAssertion<T> implements Assertion<T> {
  constructor(
    private innerAssert : InnerExpression,
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) : Result {
    const { innerAssert } = this;

    // If `testedValue` is not an array, let's just return message about `testedValue[0]` element.
    if (!contract(varName, testedValue).is.anArray.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoArrayOperator<any>(testedValue);
          const newBuilder = contract(`${varName}[0]`, wrapper.cast());
          return innerAssert(newBuilder).message;
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
      return results = (testedValue as any[])
        .map((elem, i) => innerAssert(contract(`${varName}[${i}]`, elem)))
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
      'assert must be a function (got ', (typeof args[0]), ')',
    );

    return new AllElementsAssertion(args[0]);
  }
}

export default AllElementsAssertion;

