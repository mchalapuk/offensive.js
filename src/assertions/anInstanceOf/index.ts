
import Registry from '../../Registry';
import InstanceOfAssertion from './InstanceOfAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    anInstanceOf<R>(requiredType : { new() : R }) : OperatorContext<T>;
    instanceOf<R>(requiredType : { new() : R }) : OperatorContext<T>;
  }
}

export { InstanceOfAssertion };
export default InstanceOfAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'anInstanceOf', 'instanceOf' ],

    factory: InstanceOfAssertion.factory,
  });
}

