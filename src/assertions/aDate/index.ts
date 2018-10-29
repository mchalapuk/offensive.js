
import Registry from '../../Registry';
import DateAssertion from './DateAssertion';

import * as anInstanceOf from '../anInstanceOf';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aDate : OperatorContext<T>;
    Date : OperatorContext<T>;
    date : OperatorContext<T>;
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

  registry.addAssertion({
    aDate: instance,
    Date: instance,
    date: instance,
  });
}

