
import Registry from '../../Registry';
import GreaterThanOrEqualToAssertion from './GreaterThanOrEqualToAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    greaterThanOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterThanOrEqual(comparedNumber : number) : OperatorContext<T>;
    greaterThanEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterThanEqual(comparedNumber : number) : OperatorContext<T>;
    greaterOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    greaterOrEqual(comparedNumber : number) : OperatorContext<T>;
    gte(comparedNumber : number) : OperatorContext<T>;
  }
}

export { GreaterThanOrEqualToAssertion };
export default GreaterThanOrEqualToAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    greaterThanOrEqualTo: GreaterThanOrEqualToAssertion.factory,
    greaterThanOrEqual: GreaterThanOrEqualToAssertion.factory,
    greaterThanEqualTo: GreaterThanOrEqualToAssertion.factory,
    greaterThanEqual: GreaterThanOrEqualToAssertion.factory,
    greaterOrEqualTo: GreaterThanOrEqualToAssertion.factory,
    greaterOrEqual: GreaterThanOrEqualToAssertion.factory,
    gte: GreaterThanOrEqualToAssertion.factory,
  });
}

