
import Registry from '../../Registry';
import EqualToAssertion from './EqualToAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    equalTo(comparedValue : any) : OperatorBuilder<T>;
    EqualTo(comparedValue : any) : OperatorBuilder<T>;
    equal(comparedValue : any) : OperatorBuilder<T>;
    Equal(comparedValue : any) : OperatorBuilder<T>;
    equals(comparedValue : any) : OperatorBuilder<T>;
    Equals(comparedValue : any) : OperatorBuilder<T>;
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

