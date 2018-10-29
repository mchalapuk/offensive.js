
import Registry from '../../Registry';
import MatchesAssertion from './MatchesAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    matches(exp : RegExp) : OperatorBuilder<T>;
    matchesRegExp(exp : RegExp) : OperatorBuilder<T>;
    matchesRegexp(exp : RegExp) : OperatorBuilder<T>;
    match(exp : RegExp) : OperatorBuilder<T>;
  }
}

export { MatchesAssertion };
export default MatchesAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    matches: MatchesAssertion.factory,
    matchesRegExp: MatchesAssertion.factory,
    matchesRegexp: MatchesAssertion.factory,
    match: MatchesAssertion.factory,
  });
}

