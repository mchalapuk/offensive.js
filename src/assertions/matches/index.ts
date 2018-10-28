
import Registry from '../../Registry';
import MatchesAssertion from './MatchesAssertion';

declare module "../../Context" {
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

export { MatchesAssertion };
export default MatchesAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'matches', 'matchesRegExp', 'matchesRegexp', 'match' ],

    factory: MatchesAssertion.factory,
  });
}

