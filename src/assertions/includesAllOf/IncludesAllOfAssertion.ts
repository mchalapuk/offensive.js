
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import ObjectSerializer from '../../ObjectSerializer';

import '../anArray';
import '../../connectors';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IncludesAllOfAssertion<T> implements Assertion<T> {
  constructor(
    private searchElements : any[],
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const arrayAssert = contract(varName, testedValue).is.anArray
    if (!arrayAssert.success) {
      return arrayAssert
    }

    const array = testedValue as any[]
    const { searchElements } = this

    return {
      get success() {
        return searchElements.reduce((result, elem) => result && array.includes(elem), true);
      },
      get message() {
        const elems = serializer.serializeAny(searchElements);
        return new StandardMessage(varName, `include all of ${elems}`, testedValue);
      },
    };
  }
}

export namespace IncludesAllOfAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.includesAllOf requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      Array.isArray(args[0]),
      'searchElements must be an array (got ', serializer.serializeAny(args[0]), ')',
    );

    return new IncludesAllOfAssertion(args[0]);
  }
}

export default IncludesAllOfAssertion;

