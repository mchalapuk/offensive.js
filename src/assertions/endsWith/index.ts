
import Registry from '../../Registry';
import EndsWithAssertion from './EndsWithAssertion';

import * as aString from '../aString';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    endsWith(substring: string) : OperatorBuilder<T>;
  }
}

export { EndsWithAssertion };
export default EndsWithAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aString.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    endsWith: EndsWithAssertion.factory,
  });
}

