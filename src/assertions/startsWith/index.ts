
import Registry from '../../Registry';
import StartsWithAssertion from './StartsWithAssertion';

import * as aString from '../aString';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    startsWith(substring: string) : OperatorBuilder<T>;
    startWith(substring: string) : OperatorBuilder<T>;
    startingWith(substring: string) : OperatorBuilder<T>;
  }
}

export { StartsWithAssertion };
export default StartsWithAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aString.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    startsWith: StartsWithAssertion.factory,
    startWith: StartsWithAssertion.factory,
    startingWith: StartsWithAssertion.factory,
  });
}

