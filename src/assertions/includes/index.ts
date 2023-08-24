
import Registry from '../../Registry';
import { Result } from '../../model';
import { IncludesAssertion } from './IncludesAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @assertion .includes(element : any);
   *
   * Checks if an array includes provided `element`.
   *
   * ## Example
   *
   * ```
   * // Checks if categories is an array and includes value 'functional.
   * contract('categories', categories)
   *   .includes('functional')
   *   .throwIfUnment()
   * ;
   * ```
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    includes(element : any) : OperatorBuilder<T>;
  }
}

export { IncludesAssertion };
export default IncludesAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    includes: IncludesAssertion.factory,
    contains: IncludesAssertion.factory,
  });
}

