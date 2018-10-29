
import Registry from '../../Registry';
import ExactlyAssertion from './ExactlyAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    exactly(comparedValue : any) : OperatorBuilder<T>;
    Exactly(comparedValue : any) : OperatorBuilder<T>;
    exactlyEqualTo(comparedValue : any) : OperatorBuilder<T>;
    ExactlyEqualTo(comparedValue : any) : OperatorBuilder<T>;
    exactlyEquals(comparedValue : any) : OperatorBuilder<T>;
    ExactlyEquals(comparedValue : any) : OperatorBuilder<T>;
  }
}

export { ExactlyAssertion };
export default ExactlyAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    exactly: ExactlyAssertion.factory,
    Exactly: ExactlyAssertion.factory,
    exactlyEqualTo: ExactlyAssertion.factory,
    ExactlyEqualTo: ExactlyAssertion.factory,
    exactlyEquals: ExactlyAssertion.factory,
    ExactlyEquals: ExactlyAssertion.factory,
  });
}

