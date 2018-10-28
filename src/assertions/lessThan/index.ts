
import Registry from '../../Registry';
import LessThanAssertion from './LessThanAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    lessThan(comparedNumber : number) : OperatorContext<T>;
    less(comparedNumber : number) : OperatorContext<T>;
    lt(comparedNumber : number) : OperatorContext<T>;
  }
}

export { LessThanAssertion };
export default LessThanAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'lessThan', 'less', 'lt' ],

    factory: LessThanAssertion.factory,
  });
}

