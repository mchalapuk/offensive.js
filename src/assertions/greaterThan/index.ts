
import Registry from '../../Registry';
import GreaterThanAssertion from './GreaterThanAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    greaterThan(comparedNumber : number) : OperatorContext<T>;
    greater(comparedNumber : number) : OperatorContext<T>;
    gt(comparedNumber : number) : OperatorContext<T>;
  }
}

export { GreaterThanAssertion };
export default GreaterThanAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'greaterThan', 'greater', 'gt' ],

    factory: GreaterThanAssertion.factory,
  });
}

