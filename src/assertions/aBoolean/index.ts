
import Registry from '../../Registry';
import OfTypeAssertion from '../ofType';

declare module "../../Context" {
  /**
   * @author Maciej Chałapuk (maciej@chalapuk.pl)
   */
  interface AssertionContext<T> {
    aBoolean : OperatorContext<T>;
    Boolean : OperatorContext<T>;
    boolean : OperatorContext<T>;
    aBool : OperatorContext<T>;
    Bool : OperatorContext<T>;
    bool : OperatorContext<T>;
  }
}

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export function registerIn(registry : Registry) {
  registry.addAssertion({
    names: [ 'aBoolean', 'Boolean', 'boolean', 'aBool', 'Bool', 'bool' ],
    assertion: new OfTypeAssertion('boolean'),
  });
}

