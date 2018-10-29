
import Registry from '../../Registry';
import { ElementThatAssertion, ElementThatCallback } from './ElementThatAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    elementThat<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorBuilder<T>;
    elementWhich<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorBuilder<T>;
  }
}

export { ElementThatAssertion };
export default ElementThatAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  anArray.registerIn(registry);
  connectors.registerIn(registry);

  registry.addAssertionFactory({
    elementThat: ElementThatAssertion.factory,
    elementWhich: ElementThatAssertion.factory,
  });
}

