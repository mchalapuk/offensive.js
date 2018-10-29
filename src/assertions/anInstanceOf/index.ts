
import Registry from '../../Registry';
import InstanceOfAssertion from './InstanceOfAssertion';

declare module "../../Builder" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionBuilder<T> {
    anInstanceOf<R>(requiredType : { new() : R }) : OperatorBuilder<T>;
    instanceOf<R>(requiredType : { new() : R }) : OperatorBuilder<T>;
  }
}

export { InstanceOfAssertion };
export default InstanceOfAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    anInstanceOf: InstanceOfAssertion.factory,
    instanceOf: InstanceOfAssertion.factory,
  });
}

