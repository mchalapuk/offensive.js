
import Registry from '../../Registry';
import EqualToAssertion from './EqualToAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    equalTo(comparedValue : any) : OperatorContext<T>;
    EqualTo(comparedValue : any) : OperatorContext<T>;
    equal(comparedValue : any) : OperatorContext<T>;
    Equal(comparedValue : any) : OperatorContext<T>;
    equals(comparedValue : any) : OperatorContext<T>;
    Equals(comparedValue : any) : OperatorContext<T>;
  }
}

export { EqualToAssertion };
export default EqualToAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    equalTo: EqualToAssertion.factory,
    EqualTo: EqualToAssertion.factory,
    equal: EqualToAssertion.factory,
    Equal: EqualToAssertion.factory,
    equals: EqualToAssertion.factory,
    Equals: EqualToAssertion.factory,
  });
}

