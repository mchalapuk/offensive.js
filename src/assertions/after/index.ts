
import Registry from '../../Registry';
import AfterAssertion from './AfterAssertion';

import * as aDate from '../aDate';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    after(comparedDate : Date, comparedVarName ?: string) : OperatorBuilder<T>;
  }
}

export { AfterAssertion };
export default AfterAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  aDate.registerIn(registry);

  registry.addAssertionFactory({
    after: AfterAssertion.factory,
  });
}

