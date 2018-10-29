
import Registry from '../../Registry';
import LessThanAssertion from './LessThanAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    lessThan(comparedNumber : number) : OperatorBuilder<T>;
    less(comparedNumber : number) : OperatorBuilder<T>;
    lt(comparedNumber : number) : OperatorBuilder<T>;
  }
}

export { LessThanAssertion };
export default LessThanAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    lessThan: LessThanAssertion.factory,
    less: LessThanAssertion.factory,
    lt: LessThanAssertion.factory,
  });
}

