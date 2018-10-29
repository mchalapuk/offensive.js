
import Registry from '../../Registry';
import LengthAssertion from './LengthAssertion';

import * as fieldThat from '../fieldThat';
import * as exactly from '../exactly';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    length(requiredLength : number) : OperatorContext<T>;
    len(requiredLength : number) : OperatorContext<T>;
  }
}

export { LengthAssertion };
export default LengthAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  fieldThat.registerIn(registry);
  exactly.registerIn(registry);

  registry.addAssertionFactory({
    length: LengthAssertion.factory,
    len: LengthAssertion.factory,
  });
}

