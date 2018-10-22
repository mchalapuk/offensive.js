
import Registry from '../Registry';
import { Assertion, StandardMessage } from '../model';
import { nodsl } from '../utils';

declare module "../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    matches(exp : RegExp) : OperatorContext<string>;
    matchesRegExp(exp : RegExp) : OperatorContext<string>;
    matchesRegexp(exp : RegExp) : OperatorContext<string>;
    match(exp : RegExp) : OperatorContext<string>;
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

  assert(value : any, object : string) {
    const { regexp } = this;

    return {
      get success() {
        return typeof value === 'string' && value.match(regexp) !== null;
      },
      get message() {
        return new StandardMessage(object, `match /${regexp.source}/${regexp.flags}`);
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
        `.matches requires 1 argument; got ${args.length}`,
      );
      nodsl.check(
        args[0] instanceof RegExp,
        `regexp must be isntance of RegExp; got ${typeof args[0]}`,
      );

      return new MatchesAssertion(args[0]);
    },
  })
;

