
import Registry from '../../Registry';
import GreaterThanOrEqualToAssertion from './GreaterThanOrEqualToAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    greaterThanOrEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    greaterThanOrEqual(comparedNumber : number) : OperatorBuilder<T>;
    greaterThanEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    greaterThanEqual(comparedNumber : number) : OperatorBuilder<T>;
    greaterOrEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    greaterOrEqual(comparedNumber : number) : OperatorBuilder<T>;
    gte(comparedNumber : number) : OperatorBuilder<T>;
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

