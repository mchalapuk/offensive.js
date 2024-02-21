
import Registry from '../../Registry';
import SubstringAssertion from './SubstringAssertion';

import * as aString from '../aString';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    substring(substring: string) : OperatorBuilder<T>;
    substr(substring: string) : OperatorBuilder<T>;
  }
}

export { SubstringAssertion };
export default SubstringAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aString.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    substring: SubstringAssertion.factory,
    substr: SubstringAssertion.factory,
  });
}

