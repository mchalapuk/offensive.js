
import Registry from '../../Registry';
import EmptyAssertion from './EmptyAssertion';

import * as Null from '../Null';
import * as Undefined from '../Undefined';
import * as or from '../../operators/or';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    Empty : OperatorBuilder<T>;
    empty : OperatorBuilder<T>;
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

