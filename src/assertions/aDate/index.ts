
import Registry from '../../Registry';
import DateAssertion from './DateAssertion';

import * as anInstanceOf from '../anInstanceOf';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    aDate : OperatorBuilder<T>;
    Date : OperatorBuilder<T>;
    date : OperatorBuilder<T>;
  }
}

export { DateAssertion };
export default DateAssertion;

export const instance = new DateAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anInstanceOf.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertion({
    aDate: instance,
    Date: instance,
    date: instance,
  });
}

