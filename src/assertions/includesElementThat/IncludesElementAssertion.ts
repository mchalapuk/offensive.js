
import { Assertion, ContractFunction, Result } from '../../model';
import { ObjectSerializer } from '../../ObjectSerializer';
import { nodslArguments as nodsl } from '../../NoDsl';
import { InnerExpression } from '../../Builder';

import '../anArray';
import '../../connectors';

const serializer = new ObjectSerializer()

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IncludesElementAssertion<T> implements Assertion<T> {
  constructor(
    private innerAssert : InnerExpression,
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const { innerAssert } = this;

    const arrayAssertion = contract(varName, testedValue).is.anArray
    if (!arrayAssertion.success) {
      return arrayAssertion
    }

    const array = testedValue as any[];
    let results : Result[] | null = null;

    /**
     * @return lazy-loaded results.
     */
    function getResults() {
      if (results !== null) {
        return results;
      }
      return results = array
        .map((elem, i) => innerAssert(contract(`${varName}[${i}]`, elem)))
      ;
    }

    return {
      get success() {
        return getResults().find(elem => elem.success) !== undefined;
      },
      get message() {
        // Successful results are not contained in the message.
        const actualValues = getResults()
          .map(result => result.message.actualValue)
        ;
        const message = innerAssert(contract(`${varName}[«any»]`, null)).message

        return {
          get varName() {
            return message.varName;
          },
          get requirement() {
            return message.requirement;
          },
          get actualValue() {
            return actualValues;
          },
          toString() {
            const actual = serializer.serializeAny(this.actualValue);
            return `${this.varName} must ${this.requirement} (got ${actual})`;
          },
        };
      },
    };
  }
}

export namespace IncludesElementAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.includesElementThat requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'function',
      'assert must be a function (got ', (typeof args[0]), ')',
    );

    return new IncludesElementAssertion(args[0]);
  }
}

export default IncludesElementAssertion;

