
import Registry from '../../Registry';
import { ElementThatAssertion, ElementThatCallback } from './ElementThatAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    elementThat<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorContext<T>;
    elementWhich<E>(elementIndex : number, callback : ElementThatCallback<E>) : OperatorContext<T>;
  }
}

export { ElementThatAssertion };
export default ElementThatAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'elementThat', 'elementWhich' ],

    factory: ElementThatAssertion.factory,
  });
}

