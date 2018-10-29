
import Registry from '../../Registry';
import GreaterThanAssertion from './GreaterThanAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    greaterThan(comparedNumber : number) : OperatorBuilder<T>;
    greater(comparedNumber : number) : OperatorBuilder<T>;
    gt(comparedNumber : number) : OperatorBuilder<T>;
  }
}

export { GreaterThanAssertion };
export default GreaterThanAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    greaterThan: GreaterThanAssertion.factory,
    greater: GreaterThanAssertion.factory,
    gt: GreaterThanAssertion.factory,
  });
}

