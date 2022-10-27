
import { Assertion, ContractFunction, Result, Message, StandardMessage, BinaryOperator } from '../../model';
import { NoObject } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';
import { InnerExpression } from '../../Builder';

import '../../operators/not';
import '../Empty';
import '../../connectors';

let objectNumber = 0;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class AllFieldsAssertion implements Assertion {
  constructor(
    private innerAssert : InnerExpression,
  ) {
  }

  assert(varName : string, testedValue : any, contract : ContractFunction) : Result {
    const { innerAssert } = this;

    if (!contract(varName, testedValue).is.not.Empty.success) {
      return {
        get success() {
          return false;
        },
        get message() {
          const wrapper = new NoObject(testedValue);
          const newBuilder = contract(`${varName}.<all-fields>`, wrapper.cast());
          return innerAssert(newBuilder).message;
        },
      };
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
      results = [];
      for (const key in testedValue) {
        results.push(innerAssert(contract(`${varName}.${key}`, testedValue[key])));
      }
      return results;
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
            return `»allFIeldsThat-[${varNames.join(', ')}]-${objectNumber++}`;
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

export namespace AllFieldsAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.allFieldsThat requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'function',
      'assert must be a function (got ', (typeof args[0]), ')',
    );

    return new AllFieldsAssertion(args[0]);
  }
}

export default AllFieldsAssertion;

