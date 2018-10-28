
import { Assertion, StandardMessage } from '../../model';
import { nodslArguments as nodsl } from '../../NoDsl';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class MatchesAssertion implements Assertion {
  constructor(
    private regexp : RegExp,
  ) {
  }

  assert(testedValue : any, varName : string) {
    const { regexp } = this;

    function flags() {
      return `${regexp.global ? 'g': ''}${regexp.ignoreCase ? 'i': ''}${regexp.multiline ? 'm': ''}`;
    }
    return {
      get success() {
        return typeof testedValue === 'string' && testedValue.match(regexp) !== null;
      },
      get message() {
        return new StandardMessage(varName, `match /${regexp.source}/${flags()}`, testedValue);
      },
    };
  }
}

export namespace MatchesAssertion {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  export function factory(args : any[]) {
    nodsl.check(
      args.length === 1,
      '.matches requires 1 argument (got ', args.length, ')',
    );
    nodsl.check(
      args[0] instanceof RegExp,
      'regexp must be isntance of RegExp (got ', (typeof args[0]), ')',
    );

    return new MatchesAssertion(args[0]);
  }
}

export default MatchesAssertion;

