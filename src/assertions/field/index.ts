
import Registry from '../../Registry';
import FieldAssertion from './FieldAssertion';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    field(fieldName : string) : OperatorContext<T>;
    property(fieldName : string) : OperatorContext<T>;
  }
}

export { FieldAssertion };
export default FieldAssertion;

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertionFactory({
    names: [ 'field', 'property' ],

    factory: FieldAssertion.factory,
  });
}

