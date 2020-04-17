
import Registry from '../../Registry';
import BeforeAssertion from './BeforeAssertion';

import * as aDate from '../aDate';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    before(comparedDate : Date, comparedVarName ?: string) : OperatorBuilder<T>;
  }
}

export { BeforeAssertion };
export default BeforeAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aDate.registerIn(registry);

  registry.addAssertionFactory({
    before: BeforeAssertion.factory,
  });
}

