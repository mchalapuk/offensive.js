
import Registry from '../../Registry';
import LessThanOrEqualToAssertion from './LessThanOrEqualToAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    lessThanOrEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    lessThanOrEqual(comparedNumber : number) : OperatorBuilder<T>;
    lessThanEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    lessThanEqual(comparedNumber : number) : OperatorBuilder<T>;
    lessOrEqualTo(comparedNumber : number) : OperatorBuilder<T>;
    lessOrEqual(comparedNumber : number) : OperatorBuilder<T>;
    lte(comparedNumber : number) : OperatorBuilder<T>;
  }
}

export { LessThanOrEqualToAssertion };
export default LessThanOrEqualToAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    lessThanOrEqualTo: LessThanOrEqualToAssertion.factory,
    lessThanOrEqual: LessThanOrEqualToAssertion.factory,
    lessThanEqualTo: LessThanOrEqualToAssertion.factory,
    lessThanEqual: LessThanOrEqualToAssertion.factory,
    lessOrEqualTo: LessThanOrEqualToAssertion.factory,
    lessOrEqual: LessThanOrEqualToAssertion.factory,
    lte: LessThanOrEqualToAssertion.factory,
  });
}

