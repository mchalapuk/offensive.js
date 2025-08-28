import Registry from '../../Registry';
import UUIDAssertion from './UUIDAssertion';

import * as matches from '../matches';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aUUID : OperatorBuilder<T>;
    UUID : OperatorBuilder<T>;
  }
}

export { UUIDAssertion };
export default UUIDAssertion;

export const instance = new UUIDAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  matches.registerIn(registry);
  
  registry.addAssertion({
    aUUID: instance,
    UUID: instance,
  });
}
