
import Registry from '../../Registry';
import InRangeAssertion from './InRangeAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    inRange(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
    between(lowerBounds : number, upperBounds : number) : OperatorContext<T>;
  }
}

export { InRangeAssertion };
export default InRangeAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'inRange', 'between' ],

    factory: InRangeAssertion.factory,
  });
}

