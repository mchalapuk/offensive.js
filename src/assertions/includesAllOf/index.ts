
import Registry from '../../Registry';
import { Result } from '../../model';
import { IncludesAllOfAssertion } from './IncludesAllOfAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @assertion .includesAllOf(elements : any[]);
   *
   * Checks if an array includes all of provided `elements`.
   *
   * ## Example
   *
   * ```
   * // Checks if categories is an array and includes value 'functional' and 'performance'.
   * contract('categories', categories)
   *   .includesAllOf(['functional', 'performance'])
   *   .throwIfUnment()
   * ;
   * ```
   *
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    includesAllOf(elements : any[]) : OperatorBuilder<T>;
    includesAll(elements : any[]) : OperatorBuilder<T>;
  }
}

export { IncludesAllOfAssertion };
export default IncludesAllOfAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    includesAllOf: IncludesAllOfAssertion.factory,
    includesAll: IncludesAllOfAssertion.factory,
  });
}

