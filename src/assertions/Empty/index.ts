
import Registry from '../../Registry';
import EmptyAssertion from './EmptyAssertion';

import * as Null from '../Null';
import * as Undefined from '../Undefined';
import * as or from '../../operators/or';
import * as connectors from '../../connectors';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    Empty : OperatorContext<T>;
    empty : OperatorContext<T>;
  }
}

export { EmptyAssertion };
export default EmptyAssertion;

export const instance = new EmptyAssertion();

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  Null.registerIn(registry);
  Undefined.registerIn(registry);
  or.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertion({
    Empty: instance,
    empty: instance,
  });
}

