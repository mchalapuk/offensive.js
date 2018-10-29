
import Registry from '../../Registry';
import LengthAssertion from './LengthAssertion';

import * as fieldThat from '../fieldThat';
import * as exactly from '../exactly';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    length(requiredLength : number) : OperatorBuilder<T>;
    len(requiredLength : number) : OperatorBuilder<T>;
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

