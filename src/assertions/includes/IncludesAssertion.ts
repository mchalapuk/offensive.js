
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';
import ObjectSerializer from '../../ObjectSerializer';

import '../anArray';
import '../../connectors';

const serializer = new ObjectSerializer();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class IncludesAssertion<T> implements Assertion<T> {
  constructor(
    private searchElement : any,
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const arrayAssert = contract(varName, testedValue).is.anArray
    if (!arrayAssert.success) {
      return arrayAssert
    }

    const array = testedValue as any[]
    const { searchElement } = this

    return {
      get success() {
        return array.includes(searchElement);
      },
      get message() {
        const elem = serializer.serializeAny(searchElement);
        return new StandardMessage(varName, `include ${elem}`, testedValue);
      },
    };
  }
}

export namespace IncludesAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.includes requires 1 argument (got ', args.length, ')',
    );

    return new IncludesAssertion(args[0]);
  }
}

export default IncludesAssertion;

