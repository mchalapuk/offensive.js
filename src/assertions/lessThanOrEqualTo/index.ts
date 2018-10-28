
import Registry from '../../Registry';
import LessThanOrEqualToAssertion from './LessThanOrEqualToAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    lessThanOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessThanOrEqual(comparedNumber : number) : OperatorContext<T>;
    lessThanEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessThanEqual(comparedNumber : number) : OperatorContext<T>;
    lessOrEqualTo(comparedNumber : number) : OperatorContext<T>;
    lessOrEqual(comparedNumber : number) : OperatorContext<T>;
    lte(comparedNumber : number) : OperatorContext<T>;
  }
}

export { LessThanOrEqualToAssertion };
export default LessThanOrEqualToAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [
      'lessThanOrEqualTo',
      'lessThanOrEqual',
      'lessThanEqualTo',
      'lessThanEqual',
      'lessOrEqualTo',
      'lessOrEqual',
      'lte',
    ],

    factory: LessThanOrEqualToAssertion.factory,
  });
}

