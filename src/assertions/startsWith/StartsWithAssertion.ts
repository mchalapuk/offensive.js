
import { Assertion, ContractFunction, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

import '../aString';
import '../../connectors';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class StartsWithAssertion<T> implements Assertion<T> {
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
        return (<string> testedValue).startsWith(substring)
      },
      get message() {
        return new StandardMessage(varName, `start with '${substring}'`, testedValue);
      },
    };
  }
}

export default StartsWithAssertion;

export namespace StartsWithAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.startWith requires single argument (got ', args.length, ')',
    );
    nodsl.check(
      typeof args[0] === 'string',
      'substring must be a string (got ', (typeof args[0]), ')',
    );

    return new StartsWithAssertion(args[0]);
  }
}

