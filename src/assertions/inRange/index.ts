
import Registry from '../../Registry';
import InRangeAssertion from './InRangeAssertion';

import * as greaterThanOrEqualTo from '../greaterThanOrEqualTo';
import * as lessThan from '../lessThan';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    inRange(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
    between(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
  }
}

export { InRangeAssertion };
export default InRangeAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  greaterThanOrEqualTo.registerIn(registry);
  lessThan.registerIn(registry);

  registry.addAssertionFactory({
    inRange: InRangeAssertion.factory,
    between: InRangeAssertion.factory,
  });
}

