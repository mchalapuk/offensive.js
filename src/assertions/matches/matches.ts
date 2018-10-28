
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodslArguments as nodsl } from '../NoDsl';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    matches(exp : RegExp) : OperatorContext<T>;
    matchesRegExp(exp : RegExp) : OperatorContext<T>;
    matchesRegexp(exp : RegExp) : OperatorContext<T>;
    match(exp : RegExp) : OperatorContext<T>;
  }
}

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

export default MatchesAssertion;

Registry.instance
  .addAssertionFactory({
    names: [ 'matches', 'matchesRegExp', 'matchesRegexp', 'match' ],

    factory: (args : any[]) => {
      nodsl.check(
        args.length === 1,
        '.matches requires 1 argument (got ', args.length, ')',
      );
      nodsl.check(
        args[0] instanceof RegExp,
        'regexp must be isntance of RegExp (got ', (typeof args[0]), ')',
      );

      return new MatchesAssertion(args[0]);
    },
  })
;

