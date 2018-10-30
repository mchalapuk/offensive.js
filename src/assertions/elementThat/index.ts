
import Registry from '../../Registry';
import { Result } from '../../model';
import ElementThatAssertion from './ElementThatAssertion';

import * as anArray from '../anArray';
import * as connectors from '../../connectors';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    elementThat(elementIndex : number, assert : InnerExpression) : OperatorBuilder<T>;
    elementWhich(elementIndex : number, assert : InnerExpression) : OperatorBuilder<T>;
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

