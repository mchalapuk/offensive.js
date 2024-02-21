
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

import '../aString';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class SubstringAssertion<T> implements Assertion<T> {
  constructor(
    private substring: string,
  ) {
  }

  assert(varName : string, testedValue : T, contract : ContractFunction) {
    const { substring } = this

    const isString = contract(varName, testedValue).is.aString
    if (!isString.success) {
      return isString;
    }
    return {
      get success() {
        return (<string> testedValue).indexOf(substring) !== -1
      },
      get message() {
        return new StandardMessage(varName, `have substring '${substring}'`, testedValue);
      },
    };
  }
}

export default SubstringAssertion;

export namespace SubstringAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.substring requires single argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'string',
      'substring must be a string (got ', (typeof args[0]), ')',
    );

    return new SubstringAssertion(args[0]);
  }
}

